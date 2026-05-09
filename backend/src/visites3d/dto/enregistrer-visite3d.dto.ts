import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnregistrerVisite3DDto {
  @ApiProperty({ description: 'ID du chercheur', example: 1 })
  @IsInt()
  @IsPositive()
  chercheurId: number;

  @ApiProperty({ description: 'ID du logement', example: 1 })
  @IsInt()
  @IsPositive()
  logementId: number;

  @ApiProperty({
    description: 'Durée de la visite en secondes',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  dureeVisite?: number;
}
