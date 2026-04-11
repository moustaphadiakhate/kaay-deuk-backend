import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterPaiementDto } from './dto/filter-paiement.dto';

const PAIEMENT_INCLUDE = {
  locataire: {
    include: {
      chercheur: {
        include: {
          utilisateur: { select: { id: true, nom: true, email: true, telephone: true } },
        },
      },
    },
  },
  reservation: {
    select: {
      id: true,
      statut: true,
      dateDebut: true,
      dateFin: true,
      montantTotal: true,
      logement: { select: { id: true, titre: true, ville: true } },
    },
  },
} satisfies Prisma.PaiementInclude;

@Injectable()
export class PaiementsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters: FilterPaiementDto) {
    const {
      page = 1,
      limit = 10,
      statut,
      methode,
      locataireId,
      reservationId,
      sortBy = 'dateCreation',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where: Prisma.PaiementWhereInput = {};

    if (statut) where.statut = statut;
    if (methode) where.methode = methode;
    if (locataireId) where.locataireId = locataireId;
    if (reservationId) where.reservationId = reservationId;

    const allowed = ['dateCreation', 'datePaiement', 'montant', 'statut'];
    const orderField = allowed.includes(sortBy) ? sortBy : 'dateCreation';
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await this.prisma.$transaction([
      this.prisma.paiement.findMany({
        where,
        include: PAIEMENT_INCLUDE,
        orderBy: { [orderField]: orderDir },
        skip,
        take: limit,
      }),
      this.prisma.paiement.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id },
      include: PAIEMENT_INCLUDE,
    });
    if (!paiement) throw new NotFoundException(`Paiement #${id} introuvable`);
    return paiement;
  }
}
