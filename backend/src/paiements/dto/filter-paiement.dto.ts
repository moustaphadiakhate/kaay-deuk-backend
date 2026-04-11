import { IsOptional, IsString, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPaiementDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ example: 'EN_ATTENTE', enum: ['EN_ATTENTE', 'PAYE', 'ECHOUE', 'REMBOURSE'] })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ example: 'WAVE', enum: ['WAVE', 'ORANGE_MONEY', 'CARTE', 'ESPECES'] })
  @IsOptional()
  @IsString()
  methode?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  locataireId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reservationId?: number;

  @ApiPropertyOptional({ example: 'dateCreation' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
