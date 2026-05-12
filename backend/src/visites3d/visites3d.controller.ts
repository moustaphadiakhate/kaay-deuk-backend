import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Visites3DService } from './visites3d.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnregistrerVisite3DDto } from './dto/enregistrer-visite3d.dto';

@ApiTags('visites-3d')
@Controller('visites-3d')
export class Visites3DController {
  constructor(private readonly visites3DService: Visites3DService) { }

  @Get('verifier-acces/:chercheurId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vérifier si un chercheur peut accéder aux visites 3D' })
  @ApiResponse({ status: 200, description: 'Statut d\'accès retourné' })
  async verifierAcces(@Param('chercheurId', ParseIntPipe) chercheurId: number) {
    return this.visites3DService.verifierAccesVisite3D(chercheurId);
  }

  @Post('enregistrer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer une nouvelle visite 3D' })
  @ApiResponse({ status: 201, description: 'Visite 3D enregistrée' })
  @ApiResponse({ status: 403, description: 'Abonnement requis' })
  async enregistrerVisite(@Body() dto: EnregistrerVisite3DDto) {
    return this.visites3DService.enregistrerVisite3D(
      dto.chercheurId,
      dto.logementId,
      dto.dureeVisite,
    );
  }

  @Get('historique/:chercheurId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer l\'historique des visites 3D d\'un chercheur' })
  @ApiResponse({ status: 200, description: 'Historique retourné' })
  async getHistorique(@Param('chercheurId', ParseIntPipe) chercheurId: number) {
    return this.visites3DService.getHistoriqueVisites(chercheurId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer toutes les visites 3D (pour l\'admin)' })
  @ApiResponse({ status: 200, description: 'Toutes les visites 3D' })
  async getAllVisites3D(@Request() req: any) {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;
    const take = limit;
    return this.visites3DService.getAllVisites3D(skip, take);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer une visite 3D par son ID (pour l\'admin)' })
  @ApiResponse({ status: 200, description: 'Visite 3D trouvée' })
  @ApiResponse({ status: 404, description: 'Visite 3D introuvable' })
  async getVisite3DById(@Param('id', ParseIntPipe) id: number) {
    return this.visites3DService.getVisite3DById(id);
  }
}
