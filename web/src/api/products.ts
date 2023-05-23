// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { Color } from '@/colors';
import { Product, ProductCreation } from '@/product';
import { UserRegisterData, User } from '@/users';
import { APIClient } from '.';

/**
 * ProductsClient is a http implementation of users API.
 * Exposes all users-related functionality.
 */
export class ProductsClient extends APIClient {
    private readonly ROOT_PATH: string = '/api/v0';

    /** gets product */
    public async product(): Promise<Product> {
        const path = `${this.ROOT_PATH}/product`;
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
            [],
            product.isAvailable,
            product.colors,
            product.IsLiked
        )
    }

    /** gets list of products */
    public async list(): Promise<Product[]> {
        const path = `${this.ROOT_PATH}/products`;
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
                [],
                product.isAvailable,
                product.colors,
                product.IsLiked
            )
        )
    }
    /** creates product */
    public async create(productCreation: ProductCreation): Promise<void> {
        const path = `${this.ROOT_PATH}/product/create`;
        const response = await this.http.post(path, JSON.stringify(productCreation));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async delete(productId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/product/delete`;
        const response = await this.http.post(path, productId);

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async likeProduct(productId: string, userId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/product/delete`;
        const response = await this.http.post(path, JSON.stringify({ productId, userId }));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** creates product */
    public async unlikeProduct(productId: string, userId: string): Promise<void> {
        const path = `${this.ROOT_PATH}/product/delete`;
        const response = await this.http.post(path, JSON.stringify({ productId, userId }));

        if (!response.ok) {
            await this.handleError(response);
        }
    }

    /** updates product */
    public async update(product: Product): Promise<void> {
        const path = `${this.ROOT_PATH}/product/product`;
        const response = await this.http.post(path, JSON.stringify(product));

        if (!response.ok) {
            await this.handleError(response);
        }
    }
}
