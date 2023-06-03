// Copyright (C) 2022 Creditor Corp. Group.
// See LICENSE for copying information.

import { Dispatch } from 'redux';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { UsersClient } from '@/api/users';
import { BadRequestError } from '@/api';
import { UsersService } from '@/users/service';
import { userSlice } from '@/app/store/reducers/users';
import { setErrorMessage } from '@/app/store/reducers/error';
import { UserRegisterData, UserUpdateData } from '@/users';

const usersClient = new UsersClient();
export const usersService = new UsersService(usersClient);

export const register = createAsyncThunk(
    '/auth/register',
    async function(user: UserRegisterData) {
        await usersService.register(user);
    }
);

export const updateUser = createAsyncThunk(
    '/users',
    async function(user: UserUpdateData) {
        await usersService.update(user);
    }
);

export const getUser = () => async function(dispatch: Dispatch) {
    try {
        const user = await usersService.getUser();
        dispatch(userSlice.actions.setUser(user));
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            dispatch(setErrorMessage('No valid user info'));
        }
    }
};

export const getLikedProducts = () => async function(dispatch: Dispatch) {
    try {
        const products = await usersService.likedProducts();
        dispatch(userSlice.actions.setLikedProducts(products));
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            dispatch(setErrorMessage('No valid user info'));
        }
    }
};

export const logout = createAsyncThunk(
    '/auth/logout',
    async function() {
        await usersService.logout();
        window.localStorage.setItem('IS_LOGGEDIN', JSON.stringify(false));
    }
);
