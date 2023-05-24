// Copyright (C) 2022 Creditor Corp. Group.
// See LICENSE for copying information.

import { Dispatch } from 'redux';

import { BadRequestError } from '@/api';
import { setErrorMessage } from '@/app/store/reducers/error';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';
import { productsSlice } from '../reducers/products';

const productsClient = new ProductsClient();
export const productsService = new ProductsService(productsClient);

// export const likePhoto = createAsyncThunk(
//     '/products/like',
//     async function (user: UserRegisterData) {
//         await usersService.register(user)
//     }
// );

// export const unLikePhoto = createAsyncThunk(
//     '/products/like',
//     async function (user: UserRegisterData) {
//         await usersService.register(user)
//     }
// );

export const productsList = () => async function (dispatch: Dispatch) {
    try {
        const products = await productsService.list();
        dispatch(productsSlice.actions.list(products));
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            dispatch(setErrorMessage('No valid list'));
        }
    }
};