import { Module } from '@nestjs/common';
import { LogementsController } from './logements.controller';
import { LogementsService } from './logements.service';
import { LogementsRepository } from './logements.repository';

@Module({
  controllers: [LogementsController],
  providers: [LogementsService, LogementsRepository],
  exports: [LogementsService],
})
export class LogementsModule { }
