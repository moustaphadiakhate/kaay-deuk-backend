import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  admin: {
    id: number;
    email: string;
    nom: string;
    type: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async adminLogin(dto: AdminLoginDto): Promise<LoginResult> {
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    // ── Vérification super admin via variables d'environnement ────────────────
    if (
      superAdminEmail &&
      superAdminPassword &&
      dto.email === superAdminEmail &&
      dto.password === superAdminPassword
    ) {
      this.logger.log(`Super admin connecté via env: ${dto.email}`);

      const payload: JwtPayload = {
        sub: 0,
        email: dto.email,
        type: 'SUPER_ADMIN',
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
        admin: {
          id: 0,
          email: dto.email,
          nom: 'Super Admin',
          type: 'SUPER_ADMIN',
        },
      };
    }

    // ── Fallback : vérification en base de données ─────────────────────────────
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
      include: { administrateur: true },
    });

    if (!utilisateur || !utilisateur.administrateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isValidPassword = await bcrypt.compare(dto.password, utilisateur.motDePasse);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    this.logger.log(`Admin DB connecté: ${dto.email}`);

    const payload: JwtPayload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      type: 'ADMINISTRATEUR',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      admin: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        type: 'ADMINISTRATEUR',
      },
    };
  }
}
