import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogementsModule } from './logements/logements.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminsModule } from './admins/admins.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { PaiementsModule } from './paiements/paiements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    LogementsModule,
    UploadsModule,
    AdminsModule,
    ReservationsModule,
    UtilisateursModule,
    PaiementsModule,
  ],
})
export class AppModule { }
