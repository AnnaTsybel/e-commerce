import { Category } from '.';

import { CategoriesClient } from '@/api/categories';

/**
 * Exposes all products related logic.
 */
export class CategoriesService {
    private readonly categories: CategoriesClient;
    /** UsersService contains http implementation of users API  */
    public constructor(categories: CategoriesClient) {
        this.categories = categories;
    }
    /** product */
    public async currentCategory(categoryId: string): Promise<Category> {
        return await this.categories.currentCategory(categoryId);
    }
    /** product */
    public async listCategories(): Promise<Category[]> {
        return await this.categories.listCategories();
    }
}