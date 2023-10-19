import { createAsyncThunk } from '@reduxjs/toolkit';

import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';
import { ProductCreation, ProductEdit, ProductFilter } from '@/product';

const productsClient = new ProductsClient();
export const productsService = new ProductsService(productsClient);

export const likeProduct = createAsyncThunk(
    '/products/like',
    async function(productId: string) {
        await productsService.likeProduct(productId);
    }
);

export const unlikeProduct = createAsyncThunk(
    '/products/unlike',
    async function(productId: string) {
        await productsService.unlikeProduct(productId);
    }
);

export const getListByCategory = createAsyncThunk(
    '/products/list/categories',
    async function(subsubcategoryId: string) {
        const products = await productsService.list(subsubcategoryId);

        return products;
    }
);

export const filterProducts = createAsyncThunk(
    '/products/filters',
    async function(productFilter: ProductFilter) {
        const products = await productsService.filterProducts(productFilter);

        return products;
    }
);


export const create = createAsyncThunk(
    '/products',
    async function(product: ProductCreation) {
        await productsService.create(product);
    }
);

export const deleteProductData = createAsyncThunk(
    '/products',
    async function(productId: string) {
        await productsService.delete(productId);

        return productId;
    }
);

export const updateProduct = createAsyncThunk(
    '/products',
    async function(product: ProductEdit) {
        await productsService.update(product);
    }
);

export const getProduct = createAsyncThunk(
    'products/item',
    async(productId: string) => {
        const response = await productsService.product(productId);

        return response;
    }
);

export const productRecommendation = createAsyncThunk(
    'products/recommedation-item',
    async(productId: string) => {
        const products = await productsService.productRecommendations(productId);

        return products;
    }
);

export const getRecommendationForHomePage = createAsyncThunk(
    'products/recommedation/for/home',
    async() => {
        const products = await productsService.getRecommendationForHome();

        return products;
    }
);

export const searchProducts = createAsyncThunk(
    '/search/products',
    async function(text: string) {
        const products = await productsService.searchProducts(text);

        return products;
    }
);
