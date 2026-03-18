import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TripService {
    private prisma;
    constructor(prisma: PrismaService);
    private getSeatCapacity;
    private toTripView;
    create(createTripDto: CreateTripDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        departureTime: Date;
        arrivalTime: Date;
        busId: string;
    }>;
    findAll(date?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTripDto: UpdateTripDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        departureTime: Date;
        arrivalTime: Date;
        busId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        departureTime: Date;
        arrivalTime: Date;
        busId: string;
    }>;
}
