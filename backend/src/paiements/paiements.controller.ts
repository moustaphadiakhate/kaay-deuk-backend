import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaiementsService } from './paiements.service';
import { FilterPaiementDto } from './dto/filter-paiement.dto';

@ApiTags('paiements')
@Controller('paiements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaiementsController {
  constructor(private readonly service: PaiementsService) { }

  @Get()
  @ApiOperation({ summary: 'Lister les paiements avec filtres et pagination' })
  @ApiResponse({ status: 200, description: '{ data, total, page, limit }' })
  findAll(@Query() filters: FilterPaiementDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Obtenir un paiement par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
