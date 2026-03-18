import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto) {
    return this.prisma.bus.create({
      data: createBusDto,
    });
  }

  async findAll() {
    return this.prisma.bus.findMany();
  }

  async findOne(id: string) {
    return this.prisma.bus.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    return this.prisma.bus.update({
      where: { id },
      data: updateBusDto,
    });
  }

  async remove(id: string) {
    return this.prisma.bus.delete({
      where: { id },
    });
  }
}
