import { Module } from '@nestjs/common';
import { BriquesController } from './briques.controller';
import { BriquesService } from './briques.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BriquesController],
  providers: [BriquesService],
  exports: [BriquesService],
})
export class BriquesModule { }
