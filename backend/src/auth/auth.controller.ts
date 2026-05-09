import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { LoginUtilisateurDto } from './dto/login-utilisateur.dto';
import { RegisterUtilisateurDto } from './dto/register-utilisateur.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion administrateur', description: 'Authentification via env vars ou base de données' })
  @ApiResponse({ status: 200, description: 'Connexion réussie — JWT retourné' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur', description: 'Authentification d\'un utilisateur (chercheur)' })
  @ApiResponse({ status: 200, description: 'Connexion réussie — JWT retourné' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(@Body() dto: LoginUtilisateurDto) {
    return this.authService.login(dto.email, dto.motDePasse);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription utilisateur', description: 'Créer un nouveau compte utilisateur (chercheur)' })
  @ApiResponse({ status: 201, description: 'Inscription réussie — JWT retourné' })
  @ApiResponse({ status: 400, description: 'Email existe déjà ou données invalides' })
  async register(@Body() dto: RegisterUtilisateurDto) {
    return this.authService.register(dto);
  }
}
