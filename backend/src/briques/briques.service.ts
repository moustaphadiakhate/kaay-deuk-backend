import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcheterBriquesDto } from './dto/acheter-briques.dto';
import { AttribuerBriquesDto } from './dto/attribuer-briques.dto';

const COUT_VISITE_BRIQUES = 200;

@Injectable()
export class BriquesService {
  constructor(private readonly prisma: PrismaService) { }

  async getSolde(chercheurId: number) {
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
      select: {
        id: true,
        briques: true,
        utilisateur: { select: { nom: true, email: true } },
      },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');
    return {
      chercheurId,
      briques: chercheur.briques,
      utilisateur: chercheur.utilisateur,
      coutVisite: COUT_VISITE_BRIQUES,
      peutVisiter: chercheur.briques >= COUT_VISITE_BRIQUES,
    };
  }

  async getHistorique(chercheurId: number) {
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');

    const transactions = await this.prisma.transactionBriques.findMany({
      where: { chercheurId },
      orderBy: { dateCreation: 'desc' },
    });
    return transactions;
  }

  /**
   * Demander l'achat de briques via Wave.
   * La transaction est créée EN_ATTENTE et doit être validée manuellement.
   * (ou automatiquement si un webhook Wave est implémenté plus tard)
   */
  async demanderAchat(dto: AcheterBriquesDto) {
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: dto.chercheurId },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');

    const reference =
      dto.referenceWave ||
      `KD-BRQ-${dto.chercheurId}-${Date.now().toString(36).toUpperCase()}`;

    // Vérifier unicité de la référence
    const existing = await this.prisma.transactionBriques.findUnique({
      where: { reference },
    });
    if (existing) throw new BadRequestException('Référence déjà utilisée');

    // Créer la transaction en attente (les briques seront créditées à la validation)
    const transaction = await this.prisma.transactionBriques.create({
      data: {
        chercheurId: dto.chercheurId,
        type: 'ACHAT_EN_ATTENTE',
        montant: dto.montant,
        description: `Achat via Wave — ${dto.montant} FCFA`,
        reference,
      },
    });

    return {
      message: 'Demande enregistrée. Votre solde sera crédité après validation.',
      transaction,
    };
  }

  /**
   * Valider une demande d'achat et créditer les briques.
   * Appelé manuellement par un admin ou via webhook Wave.
   */
  async validerAchat(transactionId: number) {
    const transaction = await this.prisma.transactionBriques.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction introuvable');
    if (transaction.type !== 'ACHAT_EN_ATTENTE') {
      throw new BadRequestException('Transaction déjà traitée');
    }

    const [updatedTx, updatedChercheur] = await this.prisma.$transaction([
      this.prisma.transactionBriques.update({
        where: { id: transactionId },
        data: { type: 'ACHAT' },
      }),
      this.prisma.chercheur.update({
        where: { id: transaction.chercheurId },
        data: { briques: { increment: transaction.montant } },
      }),
    ]);

    return { transaction: updatedTx, nouveauSolde: updatedChercheur.briques };
  }

  /**
   * Admin : attribuer des briques directement à un utilisateur.
   */
  async attribuerBriques(dto: AttribuerBriquesDto) {
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: dto.chercheurId },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');

    const [transaction, updatedChercheur] = await this.prisma.$transaction([
      this.prisma.transactionBriques.create({
        data: {
          chercheurId: dto.chercheurId,
          type: 'ATTRIBUTION',
          montant: dto.montant,
          description: dto.description || 'Attribution administrative',
          reference: `KD-ATTR-${dto.chercheurId}-${Date.now().toString(36).toUpperCase()}`,
        },
      }),
      this.prisma.chercheur.update({
        where: { id: dto.chercheurId },
        data: { briques: { increment: dto.montant } },
      }),
    ]);

    return {
      message: `${dto.montant} briques attribuées avec succès`,
      transaction,
      nouveauSolde: updatedChercheur.briques,
    };
  }

  /**
   * Déduire les briques pour une visite 3D.
   */
  async utiliserPourVisite(chercheurId: number, logementId: number) {
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');

    if (chercheur.briques < COUT_VISITE_BRIQUES) {
      throw new BadRequestException(
        `Solde insuffisant. Il vous faut ${COUT_VISITE_BRIQUES} briques. Vous en avez ${chercheur.briques}.`,
      );
    }

    const [transaction, updatedChercheur] = await this.prisma.$transaction([
      this.prisma.transactionBriques.create({
        data: {
          chercheurId,
          type: 'UTILISATION',
          montant: -COUT_VISITE_BRIQUES,
          description: `Visite 3D logement #${logementId}`,
          reference: `KD-VIS-${chercheurId}-${logementId}-${Date.now().toString(36).toUpperCase()}`,
        },
      }),
      this.prisma.chercheur.update({
        where: { id: chercheurId },
        data: { briques: { decrement: COUT_VISITE_BRIQUES } },
      }),
    ]);

    return {
      success: true,
      briquesDeduites: COUT_VISITE_BRIQUES,
      nouveauSolde: updatedChercheur.briques,
      transaction,
    };
  }

  async getAllTransactions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.transactionBriques.findMany({
        orderBy: { dateCreation: 'desc' },
        skip,
        take: limit,
        include: {
          chercheur: {
            include: {
              utilisateur: { select: { nom: true, email: true } },
            },
          },
        },
      }),
      this.prisma.transactionBriques.count(),
    ]);
    return { data, total, page, limit };
  }
}
