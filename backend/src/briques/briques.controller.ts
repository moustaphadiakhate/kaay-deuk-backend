import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BriquesService } from './briques.service';
import { AcheterBriquesDto } from './dto/acheter-briques.dto';
import { AttribuerBriquesDto } from './dto/attribuer-briques.dto';

@ApiTags('briques')
@Controller('briques')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BriquesController {
  constructor(private readonly briquesService: BriquesService) { }

  @Get('solde/:chercheurId')
  @ApiParam({ name: 'chercheurId', type: Number })
  @ApiOperation({ summary: 'Obtenir le solde de briques d\'un chercheur' })
  getSolde(@Param('chercheurId', ParseIntPipe) chercheurId: number) {
    return this.briquesService.getSolde(chercheurId);
  }

  @Get('historique/:chercheurId')
  @ApiParam({ name: 'chercheurId', type: Number })
  @ApiOperation({ summary: 'Historique des transactions de briques' })
  getHistorique(@Param('chercheurId', ParseIntPipe) chercheurId: number) {
    return this.briquesService.getHistorique(chercheurId);
  }

  @Post('acheter')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Demander un achat de briques via Wave (1 brique = 1 FCFA)' })
  @ApiResponse({ status: 201, description: 'Demande enregistrée, en attente de validation' })
  demanderAchat(@Body() dto: AcheterBriquesDto) {
    return this.briquesService.demanderAchat(dto);
  }

  @Post('valider/:transactionId')
  @ApiParam({ name: 'transactionId', type: Number })
  @ApiOperation({ summary: 'Admin: Valider une demande d\'achat et créditer les briques' })
  @HttpCode(HttpStatus.OK)
  validerAchat(@Param('transactionId', ParseIntPipe) transactionId: number) {
    return this.briquesService.validerAchat(transactionId);
  }

  @Post('attribuer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: Attribuer des briques directement à un utilisateur' })
  @ApiResponse({ status: 201, description: 'Briques attribuées' })
  attribuerBriques(@Body() dto: AttribuerBriquesDto) {
    return this.briquesService.attribuerBriques(dto);
  }

  @Post('utiliser-visite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déduire 200 briques pour accéder à une visite 3D' })
  utiliserPourVisite(
    @Body('chercheurId', ParseIntPipe) chercheurId: number,
    @Body('logementId', ParseIntPipe) logementId: number,
  ) {
    return this.briquesService.utiliserPourVisite(chercheurId, logementId);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: Lister toutes les transactions de briques' })
  getAllTransactions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.briquesService.getAllTransactions(Number(page) || 1, Number(limit) || 20);
  }
}
