// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { APIClient } from '.';

import { Category, SubCategory, SubSubCategory } from '@/categories';

/**
 * UsersClient is a http implementation of users API.
 * Exposes all users-related functionality.
 */
export class CategoriesClient extends APIClient {
    private readonly ROOT_PATH: string = '/api/v0/categories';

    /** exposes user registration logic */
    public async listCategories(): Promise<Category[]> {
        const path = `${this.ROOT_PATH}/with-children`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const categories = await response.json();

        const categoriesItem: Category[] = [];

        categories.map((category: any) => {
            const subcategories: SubCategory[] = [];
            category.subcategory.map((subcategoryItem: any) => {
                const subsubcategories: SubSubCategory[] = [];

                subcategoryItem.subsubcategory.map((subsubcategoryItem: any) =>
                    subsubcategories.push(new SubSubCategory(
                        subsubcategoryItem.id,
                        subsubcategoryItem.name,
                        subsubcategoryItem.categoryId
                    ))

                );

                subcategories.push(new SubCategory(
                    subcategoryItem.subcategory.id,
                    subcategoryItem.subcategory.name,
                    subcategoryItem.subcategory.categoryId,
                    subsubcategories
                ));
            });
            categoriesItem.push(new Category(
                category.category.id,
                category.category.name,
                category.category.categoryId,
                subcategories
            ));
        }
        );

        return categoriesItem;
    }

    /** exposes user login logic */
    public async currentCategory(categoryId: string): Promise<SubCategory[]> {
        const path = `${this.ROOT_PATH}/${categoryId}/subcategories`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const subcategories = await response.json();
        const subcategoriesItem: SubCategory[] = [];

        subcategories.map((subcategoryItem: any) => {
            const subsubcategories: SubSubCategory[] = [];
            subcategoryItem.subsubcategory.map((subsubcategoryItem: any) => {
                subsubcategories.push(new SubSubCategory(
                    subsubcategoryItem.id,
                    subsubcategoryItem.name,
                    subsubcategoryItem.categoryId
                ));
            });

            subcategoriesItem.push(new SubCategory(
                subcategoryItem.subcategory.id,
                subcategoryItem.subcategory.name,
                subcategoryItem.subcategory.categoryId,
                subsubcategories
            ));
        });

        return subcategoriesItem;
    }

    /** exposes user login logic */
    public async getSubSubcategorieItem(): Promise<SubSubCategory[]> {
        const path = `${this.ROOT_PATH}/all/subsubcategories`;
        const response = await this.http.get(path);

        if (!response.ok) {
            await this.handleError(response);
        }

        const subsubcategory = await response.json();

        const subsubcategoriesItem: SubSubCategory[] = [];

        subsubcategory.map((subsubcategoryItem: any) => {
            subsubcategoriesItem.push(new SubSubCategory(
                subsubcategoryItem.id,
                subsubcategoryItem.name,
                subsubcategoryItem.categoryId
            ));
        });

        return subsubcategoriesItem;
    }
}
