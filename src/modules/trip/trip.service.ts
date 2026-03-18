import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  private getSeatCapacity(busType: string) {
    const match = busType.match(/(\d+)/);
    if (match) {
      return Number(match[1]);
    }

    if (busType.toLowerCase().includes('vip')) {
      return 24;
    }

    return 40;
  }

  private toTripView(trip: any) {
    const bookedSeats = trip.tickets.map((ticket: any) => ticket.seatNumber);
    const capacity = this.getSeatCapacity(trip.bus.type);

    return {
      ...trip,
      bookedSeats,
      seatCapacity: capacity,
      availableSeats: Math.max(capacity - bookedSeats.length, 0),
    };
  }

  async create(createTripDto: CreateTripDto) {
    return this.prisma.trip.create({
      data: createTripDto,
    });
  }

  async findAll(date?: string) {
    const where = date
      ? {
          departureTime: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
        }
      : undefined;

    const trips = await this.prisma.trip.findMany({
      where,
      include: {
        bus: true,
        tickets: {
          select: { seatNumber: true },
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    return trips.map((trip) => this.toTripView(trip));
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        bus: true,
        tickets: {
          select: { seatNumber: true },
        },
      },
    });

    if (!trip) {
      return null;
    }

    return this.toTripView(trip);
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    return this.prisma.trip.update({
      where: { id },
      data: updateTripDto,
    });
  }

  async remove(id: string) {
    return this.prisma.trip.delete({
      where: { id },
    });
  }
}
