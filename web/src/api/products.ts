// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { APIClient } from '.';
import { Color } from '@/colors';
import { Product, ProductCreation, ProductEdit } from '@/product';
import { User, UserRegisterData } from '@/users';

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
            product.IsLiked,
            product.brand,
            product.numOfImages
        );
    }

    /** gets list of products */
    public async list(): Promise<Product[]> {
        const path = `${this.ROOT_PATH}`;
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
                product.IsLiked,
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
}
