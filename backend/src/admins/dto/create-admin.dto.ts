import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'Moussa Diallo' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'moussa@kaaydeuk.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+221771234567' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ example: 'MotDePasse123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  motDePasse: string;

  @ApiPropertyOptional({ example: 'SN12345678901234' })
  @IsOptional()
  @IsString()
  rib: string;
}
