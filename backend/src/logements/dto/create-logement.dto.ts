import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  IsPositive,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Vue du salon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  ordreAffichage: number;
}

export class Image3DDto {
  @ApiProperty({ example: 'https://tour.kaaydeuk.com/logement-1' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Visite 360° complète' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  ordreAffichage: number;

  @ApiProperty({ example: '360', enum: ['360', 'panorama', 'matterport'] })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class CreateLogementDto {
  @ApiProperty({ example: 'Appartement moderne Centre-Ville' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiPropertyOptional({ example: 'Bel appartement 3 pièces...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @IsPositive()
  prix: number;

  @ApiProperty({ example: 'Avenue Léopold Sédar Senghor' })
  @IsString()
  @IsNotEmpty()
  adresse: string;

  @ApiProperty({ example: 'Thiès' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ example: 85 })
  @IsNumber()
  @IsPositive()
  superficie: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  nombrePieces: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  caution?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  administrateurId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  typeLogementId: number;

  @ApiPropertyOptional({ type: [ImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  @ApiPropertyOptional({ type: [Image3DDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image3DDto)
  images3D?: Image3DDto[];
}
