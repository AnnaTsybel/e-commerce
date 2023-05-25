// Copyright (C) 2022 Creditor Corp. Group.
// See LICENSE for copying information.

import { Dispatch } from 'redux';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsSlice } from '../reducers/products';
import { BadRequestError } from '@/api';
import { setErrorMessage } from '@/app/store/reducers/error';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';
import { ProductCreation, ProductEdit } from '@/product';

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

export const productsList = () => async function(dispatch: Dispatch) {
    try {
        const products = await productsService.list();
        dispatch(productsSlice.actions.list(products));
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            dispatch(setErrorMessage('No valid list'));
        }
    }
};

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

