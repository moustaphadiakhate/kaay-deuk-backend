import { Module } from '@nestjs/common';
import { Visites3DController } from './visites3d.controller';
import { Visites3DService } from './visites3d.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Visites3DController],
  providers: [Visites3DService],
  exports: [Visites3DService],
})
export class Visites3DModule { }
