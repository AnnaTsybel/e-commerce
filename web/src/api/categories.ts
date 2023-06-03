// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { APIClient } from '.';

import { Category, SubCategory } from '@/categories';

/**
 * UsersClient is a http implementation of users API.
 * Exposes all users-related functionality.
 */
export class CategoriesClient extends APIClient {
    private readonly ROOT_PATH: string = '/api/v0/categories';

    /** exposes user registration logic */
    public async listCategories(): Promise<Category[]> {
        const path = `${this.ROOT_PATH}`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const categories = await response.json();

        return categories;
    }

    /** exposes user login logic */
    public async currentCategory(categoryId: string): Promise<Category> {
        const path = `${this.ROOT_PATH}/${categoryId}`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const category = await response.json();

        const subcategories = category.subcategories.map((subcategory: any) =>
            new SubCategory(subcategory.id, subcategory.subcategory, subcategory.subsubcategories));

        return new Category(category.id, category.catagory, subcategories);
    }
}
