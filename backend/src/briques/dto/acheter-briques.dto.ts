import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsOptional } from 'class-validator';

export class AcheterBriquesDto {
  @ApiProperty({ example: 1, description: 'ID du chercheur' })
  @IsInt()
  @IsPositive()
  chercheurId: number;

  @ApiProperty({ example: 500, description: 'Nombre de briques à acheter (1 brique = 1 FCFA)' })
  @IsInt()
  @IsPositive()
  montant: number;

  @ApiProperty({ example: 'KD-BRQ-1-ABC123', description: 'Référence Wave', required: false })
  @IsOptional()
  @IsString()
  referenceWave?: string;
}
