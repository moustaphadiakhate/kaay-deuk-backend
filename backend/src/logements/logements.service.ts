import { Injectable, NotFoundException } from '@nestjs/common';
import { LogementsRepository } from './logements.repository';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { FilterLogementDto } from './dto/filter-logement.dto';

@Injectable()
export class LogementsService {
  constructor(private readonly repository: LogementsRepository) { }

  async findAll(filters: FilterLogementDto) {
    return this.repository.findAll(filters);
  }

  async findOne(id: number) {
    const logement = await this.repository.findOne(id);
    if (!logement) {
      throw new NotFoundException(`Logement #${id} introuvable`);
    }
    return logement;
  }

  async create(dto: CreateLogementDto) {
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateLogementDto) {
    await this.findOne(id); // throws 404 if not found
    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id); // throws 404 if not found
    return this.repository.remove(id);
  }
}
