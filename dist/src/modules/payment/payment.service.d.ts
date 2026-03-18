import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        status: string;
        ticketId: string;
    }>;
    findAll(): Promise<({
        ticket: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                phone: string | null;
                role: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            trip: {
                bus: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    type: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                departureTime: Date;
                arrivalTime: Date;
                busId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingDate: Date;
            seatNumber: string;
            tripId: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        status: string;
        ticketId: string;
    })[]>;
    getSummary(): Promise<{
        totals: {
            revenue: number;
            tickets: number;
            trips: number;
            users: number;
        };
        revenueByTrip: {
            tripId: string;
            revenue: number;
            bookings: number;
            departureTime: Date;
            arrivalTime: Date;
            busType: string;
        }[];
    }>;
    findOne(id: string): Promise<({
        ticket: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                phone: string | null;
                role: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            trip: {
                bus: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    type: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                departureTime: Date;
                arrivalTime: Date;
                busId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingDate: Date;
            seatNumber: string;
            tripId: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        status: string;
        ticketId: string;
    }) | null>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        status: string;
        ticketId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentDate: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: string;
        status: string;
        ticketId: string;
    }>;
}
