import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const COUT_VISITE_BRIQUES = 200;

@Injectable()
export class Visites3DService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Vérifie si l'utilisateur peut accéder à une visite 3D.
   * La première visite est gratuite. Les suivantes coûtent 200 Briques.
   */
  async verifierAccesVisite3D(chercheurId: number) {
    const nombreVisites = await this.prisma.visite3D.count({
      where: { chercheurId },
    });

    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
      select: { briques: true },
    });
    if (!chercheur) throw new NotFoundException('Chercheur introuvable');

    // La première visite est gratuite
    if (nombreVisites === 0) {
      return {
        acces: true,
        gratuit: true,
        nombreVisitesEffectuees: 0,
        briques: chercheur.briques,
        coutVisite: COUT_VISITE_BRIQUES,
        message: 'Première visite 3D gratuite',
      };
    }

    const aSuffisamment = chercheur.briques >= COUT_VISITE_BRIQUES;

    return {
      acces: aSuffisamment,
      gratuit: false,
      nombreVisitesEffectuees: nombreVisites,
      briques: chercheur.briques,
      coutVisite: COUT_VISITE_BRIQUES,
      message: aSuffisamment
        ? `Accès autorisé — ${chercheur.briques} briques disponibles`
        : `Solde insuffisant. Il vous faut ${COUT_VISITE_BRIQUES} briques (vous en avez ${chercheur.briques}).`,
    };
  }

  /**
   * Enregistre une nouvelle visite 3D (déduit 200 briques si pas gratuite)
   */
  async enregistrerVisite3D(chercheurId: number, logementId: number, dureeVisite: number = 0) {
    const logement = await this.prisma.logement.findUnique({
      where: { id: logementId },
    });

    if (!logement) {
      throw new NotFoundException('Logement introuvable');
    }

    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
      select: { briques: true },
    });

    if (!chercheur) {
      throw new NotFoundException('Chercheur introuvable');
    }

    const verification = await this.verifierAccesVisite3D(chercheurId);

    if (!verification.acces) {
      throw new ForbiddenException(verification.message);
    }

    // Si pas gratuit (pas la première visite), déduire les briques
    const estGratuit = verification.gratuit;
    const operations: any[] = [
      this.prisma.visite3D.create({
        data: { chercheurId, logementId, dureeVisite },
      }),
    ];

    if (!estGratuit) {
      operations.push(
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
      );
    }

    const results = await this.prisma.$transaction(operations);
    const visite = results[0];

    const verificationAfter = await this.verifierAccesVisite3D(chercheurId);

    return {
      visite,
      briquesDeduites: estGratuit ? 0 : COUT_VISITE_BRIQUES,
      ...verificationAfter,
    };
  }

  /**
   * Récupère l'historique des visites 3D d'un chercheur
   */
  async getHistoriqueVisites(chercheurId: number) {
    const visites = await this.prisma.visite3D.findMany({
      where: { chercheurId },
      include: {
        logement: {
          select: {
            id: true,
            titre: true,
            ville: true,
            prix: true,
            images: true,
          },
        },
      },
      orderBy: {
        dateVisite: 'desc',
      },
    });

    const nombreVisites = visites.length;
    const verification = await this.verifierAccesVisite3D(chercheurId);

    return {
      visites,
      nombreVisites,
      ...verification,
    };
  }

  /**
   * Récupère toutes les visites 3D (pour l'admin)
   */
  async getAllVisites3D(skip: number = 0, take: number = 50) {
    const [visites, total] = await Promise.all([
      this.prisma.visite3D.findMany({
        skip,
        take,
        include: {
          chercheur: {
            include: {
              utilisateur: {
                select: {
                  nom: true,
                  email: true,
                },
              },
            },
          },
          logement: {
            select: {
              id: true,
              titre: true,
              ville: true,
              prix: true,
            },
          },
        },
        orderBy: {
          dateVisite: 'desc',
        },
      }),
      this.prisma.visite3D.count(),
    ]);

    return {
      data: visites,
      total,
    };
  }

  /**
   * Récupère une visite 3D par son ID (pour l'admin)
   */
  async getVisite3DById(id: number) {
    const visite = await this.prisma.visite3D.findUnique({
      where: { id },
      include: {
        chercheur: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                email: true,
              },
            },
          },
        },
        logement: {
          select: {
            id: true,
            titre: true,
            ville: true,
            prix: true,
          },
        },
      },
    });

    if (!visite) {
      throw new NotFoundException(`Visite 3D #${id} introuvable`);
    }

    return visite;
  }
}
