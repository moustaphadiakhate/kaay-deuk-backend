import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { LoginUtilisateurDto } from './dto/login-utilisateur.dto';
import { RegisterUtilisateurDto } from './dto/register-utilisateur.dto';
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

  async login(email: string, motDePasse: string) {
    // Rechercher l'utilisateur par email
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email },
      include: { chercheur: true },
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    this.logger.log(`Utilisateur connecté: ${email}`);

    // Créer le JWT payload
    const payload: JwtPayload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      type: utilisateur.typeUtilisateur,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        telephone: utilisateur.telephone,
        typeUtilisateur: utilisateur.typeUtilisateur,
      },
    };
  }

  async register(dto: RegisterUtilisateurDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      // Créer l'utilisateur et le chercheur dans une transaction
      const utilisateur = await this.prisma.utilisateur.create({
        data: {
          nom: dto.fullName,
          email: dto.email,
          telephone: dto.phone,
          motDePasse: hashedPassword,
          typeUtilisateur: 'CHERCHEUR',
          chercheur: {
            create: {},
          },
        },
        include: {
          chercheur: true,
        },
      });

      this.logger.log(`Nouvel utilisateur inscrit: ${dto.email}`);

      // Créer le JWT
      const payload: JwtPayload = {
        sub: utilisateur.id,
        email: utilisateur.email,
        type: utilisateur.typeUtilisateur,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        tokenType: 'Bearer',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
        utilisateur: {
          id: utilisateur.id,
          email: utilisateur.email,
          nom: utilisateur.nom,
          telephone: utilisateur.telephone,
          typeUtilisateur: utilisateur.typeUtilisateur,
        },
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'inscription: ${error.message}`);
      throw new BadRequestException('Erreur lors de l\'inscription');
    }
  }
}
