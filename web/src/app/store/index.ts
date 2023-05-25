// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { configureStore } from '@reduxjs/toolkit';
import { handleErrorMiddleware } from './middleaware';
import productsSlice from './reducers/products';
import userSlice from '@/app/store/reducers/users';

const reducer = {
    usersReducer: userSlice,
    productsReducer: productsSlice,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(handleErrorMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
