import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterUtilisateurDto } from './dto/filter-utilisateur.dto';

const USER_SELECT = {
  id: true,
  nom: true,
  email: true,
  telephone: true,
  typeUtilisateur: true,
  dateCreation: true,
  chercheur: {
    select: {
      id: true,
      reservations: { select: { id: true, statut: true } },
      favoris: { select: { id: true } },
      locataire: { select: { id: true, dateDebutContrat: true, caution: true } },
    },
  },
  administrateur: {
    select: {
      id: true,
      rib: true,
      logements: { select: { id: true, titre: true } },
    },
  },
} satisfies Prisma.UtilisateurSelect;

@Injectable()
export class UtilisateursService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters: FilterUtilisateurDto) {
    const {
      page = 1,
      limit = 10,
      typeUtilisateur,
      q,
      sortBy = 'dateCreation',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where: Prisma.UtilisateurWhereInput = {};

    if (typeUtilisateur) where.typeUtilisateur = typeUtilisateur;
    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { telephone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const allowed = ['dateCreation', 'nom', 'email'];
    const orderField = allowed.includes(sortBy) ? sortBy : 'dateCreation';
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await this.prisma.$transaction([
      this.prisma.utilisateur.findMany({
        where,
        select: USER_SELECT,
        orderBy: { [orderField]: orderDir },
        skip,
        take: limit,
      }),
      this.prisma.utilisateur.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!utilisateur) throw new NotFoundException(`Utilisateur #${id} introuvable`);
    return utilisateur;
  }
}
