import { createAsyncThunk } from '@reduxjs/toolkit';

import { CategoriesClient } from '@/api/categories';
import { CategoriesService } from '@/categories/service';

const categoriesClient = new CategoriesClient();
export const categoriesService = new CategoriesService(categoriesClient);

export const setCategories = createAsyncThunk(
    '/all-categories',
    async function() {
        const categories = await categoriesService.listCategories();

        return categories;
    }
);

export const setCurrentCategory = createAsyncThunk(
    '/id/subcategories',
    async function(categoryId: string) {
        const currentCategory = await categoriesService.currentCategory(categoryId);

        return currentCategory;
    }
);


export const setSubSubCategory = createAsyncThunk(
    '/all-subsubcategories',
    async function() {
        const subsubCategories = await categoriesService.getSubSubCategories();

        return subsubCategories;
    }
);
