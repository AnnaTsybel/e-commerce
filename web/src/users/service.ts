import { User, UserRegisterData, UserUpdateData } from '.';
import { UsersClient } from '@/api/users';
import { Product } from '@/product';

/**
 * Exposes all users related logic.
 */
export class UsersService {
    private readonly users: UsersClient;
    /** UsersService contains http implementation of users API  */
    public constructor(users: UsersClient) {
        this.users = users;
    }
    /** user registration */
    public async register(user: UserRegisterData): Promise<void> {
        await this.users.register(user);
    }
    /** user login */
    public async login(email: string, password: string): Promise<void> {
        await this.users.login(email, password);
    }
    /** gets user info */
    public async getUser(): Promise<User> {
        return await this.users.getUser();
    }

    /** gets liked products */
    public async likedProducts(): Promise<Product[]> {
        return await this.users.likedProducts();
    }

    /** gets amount of liked products */
    public async amountOflikedProducts(): Promise<number> {
        return await this.users.amountOfLikedProducts();
    }

    /** updates user info */
    public async update(user: UserUpdateData): Promise<void> {
        await this.users.update(user);
    }

    /** logouts */
    public async logout(): Promise<void> {
        await this.users.logout();
    }
}
