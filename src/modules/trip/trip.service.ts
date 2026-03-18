import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDailyTrips();
  }

  private startOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomPrice() {
    const raw = this.randomInt(450, 990);
    return Math.round(raw / 10) * 10;
  }

  private createRandomDepartureTimesForToday(count: number) {
    const start = this.startOfDay();
    const usedHours = new Set<number>();
    const times: Date[] = [];

    while (times.length < count) {
      const hour = this.randomInt(6, 22);
      if (usedHours.has(hour)) {
        continue;
      }

      usedHours.add(hour);
      const dt = new Date(start);
      dt.setHours(hour, 0, 0, 0);
      times.push(dt);
    }

    return times.sort((a, b) => a.getTime() - b.getTime());
  }

  private async ensureDefaultBuses() {
    const buses = await this.prisma.bus.findMany({
      select: { id: true, type: true },
      orderBy: { createdAt: 'asc' },
    });

    if (buses.length > 0) {
      return buses;
    }

    await this.prisma.bus.createMany({
      data: [
        { type: 'VIP 24 Seats' },
        { type: 'Air-conditioned 1st Class' },
        { type: 'Express 40 Seats' },
      ],
    });

    return this.prisma.bus.findMany({
      select: { id: true, type: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async removePastTrips() {
    const dayStart = this.startOfDay();

    await this.prisma.payment.deleteMany({
      where: {
        ticket: {
          trip: {
            departureTime: { lt: dayStart },
          },
        },
      },
    });

    await this.prisma.ticket.deleteMany({
      where: {
        trip: {
          departureTime: { lt: dayStart },
        },
      },
    });

    await this.prisma.trip.deleteMany({
      where: {
        departureTime: { lt: dayStart },
      },
    });
  }

  private async ensureDailyTrips() {
    await this.removePastTrips();

    const todayTripsCount = await this.prisma.trip.count({
      where: {
        departureTime: {
          gte: this.startOfDay(),
          lte: this.endOfDay(),
        },
      },
    });

    if (todayTripsCount >= 10) {
      return;
    }

    const buses = await this.ensureDefaultBuses();
    const departures = this.createRandomDepartureTimesForToday(10 - todayTripsCount);

    const payload = departures.map((departureTime) => {
      const durationHours = this.randomInt(8, 14);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + durationHours);
      const bus = buses[this.randomInt(0, buses.length - 1)];

      return {
        price: this.randomPrice(),
        departureTime,
        arrivalTime,
        busId: bus.id,
      };
    });

    await this.prisma.trip.createMany({ data: payload });
  }

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
    await this.ensureDailyTrips();

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
