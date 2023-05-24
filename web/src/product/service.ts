import { Product, ProductCreation, ProductEdit } from '.';
import { ProductsClient } from '@/api/products';

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
    public async product(productId: string): Promise<Product> {
        return await this.products.product(productId);
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
    public async update(product: ProductEdit): Promise<void> {
        await this.products.update(product);
    }

    /** likes product */
    public async likeProduct(productId: string): Promise<void> {
        await this.products.likeProduct(productId);
    }

    /** unlikes product */
    public async unlikeProduct(productId: string): Promise<void> {
        await this.products.unlikeProduct(productId);
    }
}
