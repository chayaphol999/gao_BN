import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BusModule } from './modules/bus/bus.module';
import { TripModule } from './modules/trip/trip.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    BusModule,
    TripModule,
    TicketModule,
    PaymentModule,
  ],
})
export class AppModule {}
