import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUtilisateurDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email de l\'utilisateur' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password@123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  motDePasse: string;
}
