import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: createPaymentDto,
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: { ticket: { include: { trip: { include: { bus: true } }, user: true } } },
      orderBy: { paymentDate: 'desc' },
    });
  }

  async getSummary() {
    const [payments, tickets, trips, users] = await Promise.all([
      this.prisma.payment.findMany({
        where: { status: 'SUCCESS' },
        include: { ticket: { include: { trip: { include: { bus: true } } } } },
      }),
      this.prisma.ticket.count(),
      this.prisma.trip.count(),
      this.prisma.user.count(),
    ]);

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    const revenueByTrip = payments.reduce<
      Record<
        string,
        {
          tripId: string;
          revenue: number;
          bookings: number;
          departureTime: Date;
          arrivalTime: Date;
          busType: string;
        }
      >
    >(
      (acc, payment) => {
        const tripId = payment.ticket.tripId;
        if (!acc[tripId]) {
          acc[tripId] = {
            tripId,
            revenue: 0,
            bookings: 0,
            departureTime: payment.ticket.trip.departureTime,
            arrivalTime: payment.ticket.trip.arrivalTime,
            busType: payment.ticket.trip.bus.type,
          };
        }

        acc[tripId].revenue += Number(payment.amount);
        acc[tripId].bookings += 1;
        return acc;
      },
      {},
    );

    return {
      totals: {
        revenue: totalRevenue,
        tickets,
        trips,
        users,
      },
      revenueByTrip: Object.values(revenueByTrip).sort(
        (left, right) => right.revenue - left.revenue,
      ),
    };
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { ticket: { include: { trip: { include: { bus: true } }, user: true } } }
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
