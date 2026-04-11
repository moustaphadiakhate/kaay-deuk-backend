import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UtilisateursService } from './utilisateurs.service';
import { FilterUtilisateurDto } from './dto/filter-utilisateur.dto';

@ApiTags('utilisateurs')
@Controller('utilisateurs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UtilisateursController {
  constructor(private readonly service: UtilisateursService) { }

  @Get()
  @ApiOperation({ summary: 'Lister les utilisateurs avec filtres et pagination' })
  @ApiResponse({ status: 200, description: '{ data, total, page, limit }' })
  findAll(@Query() filters: FilterUtilisateurDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Obtenir un utilisateur par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
