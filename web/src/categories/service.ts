import { Category, SubCategory, SubSubCategory } from '.';

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
    /** current category */
    public async currentCategory(categoryId: string): Promise<SubCategory[]> {
        return await this.categories.currentCategory(categoryId);
    }
    /** list of categories */
    public async listCategories(): Promise<Category[]> {
        return await this.categories.listCategories();
    }
    /** subsubcategories */
    public async getSubSubCategories(): Promise<SubSubCategory[]> {
        return await this.categories.getSubSubcategorieItem();
    }
}
