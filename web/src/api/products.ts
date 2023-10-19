import { APIClient } from '.';
import { Product, ProductCreation, ProductEdit, ProductFilter } from '@/product';

/**
 * ProductsClient is a http implementation of users API.
 * Exposes all users-related functionality.
 */
export class ProductsClient extends APIClient {
    private readonly ROOT_PATH: string = '/api/v0/products';

    /** gets product */
    public async product(productId: string): Promise<Product> {
        const path = `${this.ROOT_PATH}/${productId}`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const product = await response.json();

        return new Product(
            product.id,
            product.title,
            product.description,
            product.price,
            product.isAvailable,
            product.color,
            product.isLiked,
            product.brand,
            product.numOfImages
        );
    }

    /** gets list of products */
    public async list(subsubcategoryId: string): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/by/subsubcategory/${subsubcategoryId}`;
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

    /** gets list of products */
    public async productRecommendations(productId: string): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/${productId}/recommendation`;
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

    /** creates product */
    public async create(productCreation: ProductCreation): Promise<void> {
        const path = `${this.ROOT_PATH}`;
        const response = await this.http.post(path, JSON.stringify(productCreation));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async delete(productId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/${productId}`;
        const response = await this.http.delete(path);

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async likeProduct(productId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/${productId}/like`;
        const response = await this.http.post(path);

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async unlikeProduct(productId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/${productId}/like`;
        const response = await this.http.delete(path);

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** updates product */
    public async update(product: ProductEdit): Promise<void> {
        const path = `${this.ROOT_PATH}/${product.id}`;
        const response = await this.http.put(path, JSON.stringify(product));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** updates product */
    public async recommendationForHomePage(): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/recommendation/for/home`;
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

    /** Searches products */
    public async searchProducts(text: string): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/search/by/title?title=${text}`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }
        const products = await response.json();

        return products;
    };

    /** Searches products */
    public async filterProducts(productFilter: ProductFilter): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/by/subsubcategory/${productFilter.subsubCategoryId}?color=${productFilter.color}&priceFrom=${productFilter.priceFrom}&priceTo=${productFilter.priceTo}`;
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
    };
}
