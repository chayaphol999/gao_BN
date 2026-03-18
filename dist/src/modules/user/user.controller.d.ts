import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from './repositories/user.repository';
export declare class UserController {
    private createUserUseCase;
    private authService;
    private userRepo;
    constructor(createUserUseCase: CreateUserUseCase, authService: AuthService, userRepo: UserRepository);
    register(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllUsers(): Promise<{
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
