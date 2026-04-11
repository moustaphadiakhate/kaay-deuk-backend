import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReservationsService } from './reservations.service';
import { FilterReservationDto } from './dto/filter-reservation.dto';
import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateStatutDto {
  @ApiProperty({ enum: ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'] })
  @IsString()
  @IsIn(['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'])
  statut: string;
}

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) { }

  @Get()
  @ApiOperation({ summary: 'Lister les réservations avec filtres et pagination' })
  @ApiResponse({ status: 200, description: '{ data, total, page, limit }' })
  findAll(@Query() filters: FilterReservationDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Obtenir une réservation par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/statut')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une réservation' })
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStatutDto,
  ) {
    return this.service.updateStatut(id, body.statut);
  }
}
