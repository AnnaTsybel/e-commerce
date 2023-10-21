import { APIClient } from '.';
import { User, UserRegisterData, UserUpdateData } from '@/users';
import { Product } from '@/product';

const MOCK_ADMIN = 0;

/**
 * UsersClient is a http implementation of users API.
 * Exposes all users-related functionality.
 */
export class UsersClient extends APIClient {
    private readonly ROOT_PATH: string = '/api/v0/auth';

    /** exposes user registration logic */
    public async register(user: UserRegisterData): Promise<void> {
        const path = `${this.ROOT_PATH}/register`;
        const response = await this.http.post(path, JSON.stringify(user));

        if (!response.ok) {
            await this.handleError(response);
        }
    }
    /** exposes user login logic */
    public async login(email: string, password: string): Promise<void> {
        const path = `${this.ROOT_PATH}/login`;
        const response = await this.http.post(
            path,
            JSON.stringify({
                email,
                password,
            })
        );

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** Gets user */
    public async getUser(): Promise<User> {
        const path = '/api/v0/users';
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }
        const user = await response.json();

        return new User(
            user.id,
            user.name,
            user.surname,
            user.phoneNumber,
            user.email,
            MOCK_ADMIN,
            user.avatar,
            user.passwordHash,
            user.gender,
            user.createdAt,
            user.dateOfBirth,
            user.isAvatarExists
        );
    }

    /** liked products */
    public async likedProducts(): Promise<Product[]> {
        const path = '/api/v0/users/liked';
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const products = await response.json();

        return products.map((product: any) =>
            new Product(
                product.id,
                product.title,
                product.description,
                product.price,
                product.isAvailable,
                product.color,
                product.isLiked,
                product.brand,
                product.numOfImages
            )
        );
    }

    /** logout */
    public async amountOfLikedProducts(): Promise<number> {
        const path = '/api/v0/users/liked/count';
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const amountOfProducts = response.json();

        return amountOfProducts;
    }

    /** updates user */
    public async update(user: UserUpdateData): Promise<void> {
        const path = '/api/v0/users';
        const response = await this.http.put(path, JSON.stringify(user));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** logout */
    public async logout(): Promise<void> {
        const path = '/api/v0/auth/logout';
        const response = await this.http.post(path);

        if (!response.ok) {
            await this.handleError(response);
        }
    }
}
