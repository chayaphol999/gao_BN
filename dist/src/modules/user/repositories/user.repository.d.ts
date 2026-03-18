import { PrismaService } from '../../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findSafeById(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
