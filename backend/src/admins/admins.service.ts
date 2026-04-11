import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

const ADMIN_SELECT = {
  id: true,
  rib: true,
  utilisateur: {
    select: {
      id: true,
      nom: true,
      email: true,
      telephone: true,
      typeUtilisateur: true,
      dateCreation: true,
    },
  },
  logements: { select: { id: true, titre: true } },
};

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [admins, total] = await this.prisma.$transaction([
      this.prisma.administrateur.findMany({
        skip,
        take: limit,
        select: ADMIN_SELECT,
        orderBy: { id: 'desc' },
      }),
      this.prisma.administrateur.count(),
    ]);
    return {
      data: admins.map(this.mapAdmin),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const admin = await this.prisma.administrateur.findUnique({
      where: { id },
      select: ADMIN_SELECT,
    });
    if (!admin) throw new NotFoundException(`Admin #${id} introuvable`);
    return this.mapAdmin(admin);
  }

  async create(dto: CreateAdminDto) {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');

    const hash = await bcrypt.hash(dto.motDePasse, 12);
    const admin = await this.prisma.administrateur.create({
      data: {
        rib: dto.rib ?? '',
        utilisateur: {
          create: {
            nom: dto.nom,
            email: dto.email,
            telephone: dto.telephone,
            motDePasse: hash,
            typeUtilisateur: 'ADMIN',
          },
        },
      },
      select: ADMIN_SELECT,
    });
    return this.mapAdmin(admin);
  }

  async update(id: number, dto: UpdateAdminDto) {
    await this.findOne(id);
    const existing = await this.prisma.administrateur.findUnique({
      where: { id },
      select: { utilisateurId: true },
    });

    const userUpdate: Record<string, unknown> = {};
    if (dto.nom !== undefined) userUpdate.nom = dto.nom;
    if (dto.telephone !== undefined) userUpdate.telephone = dto.telephone;
    if (dto.email !== undefined) userUpdate.email = dto.email;
    if (dto.motDePasse !== undefined) {
      userUpdate.motDePasse = await bcrypt.hash(dto.motDePasse, 12);
    }

    const result = await this.prisma.administrateur.update({
      where: { id },
      data: {
        ...(dto.rib !== undefined ? { rib: dto.rib } : {}),
        ...(Object.keys(userUpdate).length
          ? { utilisateur: { update: { where: { id: existing!.utilisateurId }, data: userUpdate } } }
          : {}),
      },
      select: ADMIN_SELECT,
    });
    return this.mapAdmin(result);
  }

  async remove(id: number) {
    await this.findOne(id);
    const existing = await this.prisma.administrateur.findUnique({
      where: { id },
      select: { utilisateurId: true },
    });
    // Cascade supprime l'administrateur aussi
    await this.prisma.utilisateur.delete({ where: { id: existing!.utilisateurId } });
    return { id, message: `Admin #${id} supprimé` };
  }

  private mapAdmin(admin: {
    id: number;
    rib: string;
    utilisateur: {
      id: number;
      nom: string;
      email: string;
      telephone: string;
      typeUtilisateur: string;
      dateCreation: Date;
    };
    logements: { id: number; titre: string }[];
  }) {
    return {
      id: admin.id,
      nom: admin.utilisateur.nom,
      email: admin.utilisateur.email,
      telephone: admin.utilisateur.telephone,
      typeUtilisateur: admin.utilisateur.typeUtilisateur,
      dateCreation: admin.utilisateur.dateCreation,
      rib: admin.rib,
      logements: admin.logements,
    };
  }
}
