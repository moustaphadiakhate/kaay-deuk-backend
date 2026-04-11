import { IsOptional, IsString, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterUtilisateurDto {
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

  @ApiPropertyOptional({ example: 'ADMIN', enum: ['ADMIN', 'CHERCHEUR'] })
  @IsOptional()
  @IsString()
  typeUtilisateur?: string;

  @ApiPropertyOptional({ example: 'moussa' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'dateCreation' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
