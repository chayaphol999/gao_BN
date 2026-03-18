import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class CreateUserUseCase {
    private userRepo;
    constructor(userRepo: UserRepository);
    execute(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
