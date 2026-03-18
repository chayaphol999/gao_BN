import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: createTicketDto,
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: { trip: { include: { bus: true } }, user: true, payments: true },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async findMine(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        trip: { include: { bus: true } },
        payments: true,
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async book(userId: string, createBookingDto: CreateBookingDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBookingDto.tripId },
      include: { bus: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const existingSeat = await this.prisma.ticket.findFirst({
      where: {
        tripId: createBookingDto.tripId,
        seatNumber: createBookingDto.seatNumber,
      },
    });

    if (existingSeat) {
      throw new BadRequestException('This seat has already been booked');
    }

    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          seatNumber: createBookingDto.seatNumber,
          userId,
          tripId: createBookingDto.tripId,
          bookingDate: createBookingDto.bookingDate
            ? new Date(createBookingDto.bookingDate)
            : new Date(),
        },
        include: {
          trip: { include: { bus: true } },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          amount: trip.price,
          method: createBookingDto.paymentMethod,
          status: createBookingDto.paymentStatus,
          paymentDate: createBookingDto.paymentDate
            ? new Date(createBookingDto.paymentDate)
            : new Date(),
          ticketId: ticket.id,
        },
      });

      return {
        ...ticket,
        payments: [payment],
      };
    });
  }

  async findOne(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { trip: { include: { bus: true } }, user: true, payments: true },
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  async remove(id: string) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
