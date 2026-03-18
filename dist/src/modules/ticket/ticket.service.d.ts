import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class TicketService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTicketDto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    }>;
    findAll(): Promise<({
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
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    })[]>;
    findMine(userId: string): Promise<({
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
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    })[]>;
    book(userId: string, createBookingDto: CreateBookingDto): Promise<{
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: string;
            ticketId: string;
        }[];
        user: {
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
            role: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    }>;
    findOne(id: string): Promise<({
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
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentDate: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    }) | null>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingDate: Date;
        seatNumber: string;
        tripId: string;
        userId: string;
    }>;
}
