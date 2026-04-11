import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@kaaydeuk.com', description: 'Email administrateur' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin@123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
