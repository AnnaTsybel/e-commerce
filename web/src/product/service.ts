import { Product, ProductCreation, ProductEdit, ProductFilter } from '.';
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

    /** list of products */
    public async list(subsubcategoryId: string): Promise<Product[]> {
        return await this.products.list(subsubcategoryId);
    }

    /** products recommendation */
    public async productRecommendations(productId: string): Promise<Product[]> {
        return await this.products.productRecommendations(productId);
    }

    /** recommendations for home */
    public async getRecommendationForHome(): Promise<Product[]> {
        return await this.products.recommendationForHomePage();
    }

    /** creates product */
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

    /** searches products */
    public async searchProducts(text: string): Promise<Product[]> {
        return await this.products.searchProducts(text);
    }

    /** filters products */
    public async filterProducts(productFilter: ProductFilter): Promise<Product[]> {
        return await this.products.filterProducts(productFilter);
    }
}
