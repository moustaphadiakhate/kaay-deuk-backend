import { IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUtilisateurDto {
  @ApiProperty({ example: 'Jean Dupont', description: 'Nom complet' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email unique' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+221 77 123 45 67', description: 'Numéro de téléphone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Password@123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
