import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LogementsService } from './logements.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { FilterLogementDto } from './dto/filter-logement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('logements')
@Controller('logements')
export class LogementsController {
  constructor(private readonly logementsService: LogementsService) { }

  // ── Lecture publique ────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Lister les logements avec pagination & filtres' })
  @ApiResponse({ status: 200, description: '{ data, total, page, limit }' })
  findAll(@Query() filters: FilterLogementDto) {
    return this.logementsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un logement par son ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Logement trouvé' })
  @ApiResponse({ status: 404, description: 'Logement introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logementsService.findOne(id);
  }

  // ── Écriture protégée (JWT requis) ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau logement' })
  @ApiResponse({ status: 201, description: 'Logement créé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(@Body() dto: CreateLogementDto) {
    return this.logementsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour un logement' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Logement mis à jour' })
  @ApiResponse({ status: 404, description: 'Logement introuvable' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLogementDto) {
    return this.logementsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un logement' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Logement supprimé' })
  @ApiResponse({ status: 404, description: 'Logement introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logementsService.remove(id);
  }
}
