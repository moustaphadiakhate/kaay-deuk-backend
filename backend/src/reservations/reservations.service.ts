import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterReservationDto } from './dto/filter-reservation.dto';

const RESERVATION_INCLUDE = {
  logement: { select: { id: true, titre: true, ville: true, prix: true } },
  chercheur: {
    include: {
      utilisateur: { select: { id: true, nom: true, email: true, telephone: true } },
    },
  },
  paiements: {
    select: { id: true, montant: true, statut: true, methode: true, datePaiement: true },
  },
} satisfies Prisma.ReservationInclude;

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters: FilterReservationDto) {
    const {
      page = 1,
      limit = 10,
      statut,
      logementId,
      chercheurId,
      sortBy = 'dateReservation',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where: Prisma.ReservationWhereInput = {};

    if (statut) where.statut = statut;
    if (logementId) where.logementId = logementId;
    if (chercheurId) where.chercheurId = chercheurId;

    const allowed = ['dateReservation', 'dateDebut', 'dateFin', 'montantTotal', 'statut'];
    const orderField = allowed.includes(sortBy) ? sortBy : 'dateReservation';
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await this.prisma.$transaction([
      this.prisma.reservation.findMany({
        where,
        include: RESERVATION_INCLUDE,
        orderBy: { [orderField]: orderDir },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: RESERVATION_INCLUDE,
    });
    if (!reservation) throw new NotFoundException(`Réservation #${id} introuvable`);
    return reservation;
  }

  async updateStatut(id: number, statut: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: { statut },
      include: RESERVATION_INCLUDE,
    });
  }
}
