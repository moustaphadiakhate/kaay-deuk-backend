import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsOptional } from 'class-validator';

export class AttribuerBriquesDto {
  @ApiProperty({ example: 1, description: 'ID du chercheur à créditer' })
  @IsInt()
  @IsPositive()
  chercheurId: number;

  @ApiProperty({ example: 200, description: 'Nombre de briques à attribuer' })
  @IsInt()
  @IsPositive()
  montant: number;

  @ApiProperty({ example: 'Bonus fidélité', description: 'Motif/description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
