import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { FilterLogementDto } from './dto/filter-logement.dto';

const LOGEMENT_INCLUDE = {
  typeLogement: true,
  administrateur: {
    include: {
      utilisateur: {
        select: { id: true, nom: true, telephone: true, email: true },
      },
    },
  },
} satisfies Prisma.LogementInclude;

@Injectable()
export class LogementsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters: FilterLogementDto) {
    const {
      page = 1,
      limit = 10,
      ville,
      prixMin,
      prixMax,
      disponible,
      typeLogementId,
      sortBy = 'dateCreation',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.LogementWhereInput = {};

    if (ville) {
      where.ville = { contains: ville, mode: 'insensitive' };
    }
    if (prixMin !== undefined || prixMax !== undefined) {
      where.prix = {};
      if (prixMin !== undefined) where.prix.gte = prixMin;
      if (prixMax !== undefined) where.prix.lte = prixMax;
    }
    if (disponible !== undefined) {
      where.disponible = disponible;
    }
    if (typeLogementId) {
      where.typeLogementId = typeLogementId;
    }

    const allowedSortFields = ['dateCreation', 'prix', 'superficie', 'nombrePieces', 'titre'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'dateCreation';
    const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await this.prisma.$transaction([
      this.prisma.logement.findMany({
        where,
        include: LOGEMENT_INCLUDE,
        orderBy: { [orderField]: orderDirection },
        skip,
        take: limit,
      }),
      this.prisma.logement.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    return this.prisma.logement.findUnique({
      where: { id },
      include: LOGEMENT_INCLUDE,
    });
  }

  async create(dto: CreateLogementDto) {
    const { images, images3D, ...rest } = dto;
    return this.prisma.logement.create({
      data: {
        ...rest,
        images: (images ?? []) as unknown as Prisma.InputJsonValue,
        images3D: (images3D ?? []) as unknown as Prisma.InputJsonValue,
      },
      include: LOGEMENT_INCLUDE,
    });
  }

  async update(id: number, dto: UpdateLogementDto) {
    const { images, images3D, ...rest } = dto;
    const updateData: Prisma.LogementUpdateInput = { ...rest };

    if (images !== undefined) {
      updateData.images = images as unknown as Prisma.InputJsonValue;
    }
    if (images3D !== undefined) {
      updateData.images3D = images3D as unknown as Prisma.InputJsonValue;
    }

    return this.prisma.logement.update({
      where: { id },
      data: updateData,
      include: LOGEMENT_INCLUDE,
    });
  }

  async remove(id: number) {
    return this.prisma.logement.delete({ where: { id } });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.logement.count({ where: { id } });
    return count > 0;
  }
}
