import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class BusService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBusDto: CreateBusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
    } | null>;
    update(id: string, updateBusDto: UpdateBusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
    }>;
}
