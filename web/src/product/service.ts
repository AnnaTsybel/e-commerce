import { ProductsClient } from '@/api/products';
import { Product, ProductCreation } from '.';

/**
 * Exposes all products related logic.
 */
export class ProductsService {
    private readonly products: ProductsClient;
    /** UsersService contains http implementation of users API  */
    public constructor(products: ProductsClient) {
        this.products = products;
    }
    /** product */
    public async product(): Promise<Product> {
        return await this.products.product();
    }

    /** products list */
    public async list(): Promise<Product[]> {
        return await this.products.list();
    }

    /** creates products */
    public async create(productCreation: ProductCreation): Promise<void> {
        await this.products.create(productCreation);
    }

    /** deletes product */
    public async delete(productId: string): Promise<void> {
        await this.products.delete(productId);
    }

    /** updates product */
    public async update(product: Product): Promise<void> {
        await this.products.update(product);
    }

    /** likes product */
    public async likeProduct(productId: string, userId: string): Promise<void> {
        await this.products.likeProduct(productId, userId);
    }

    /** unlikes product */
    public async unlikeProduct(productId: string, userId: string): Promise<void> {
        await this.products.unlikeProduct(productId, userId);
    }
}
