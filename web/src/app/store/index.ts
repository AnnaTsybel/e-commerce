import { configureStore } from '@reduxjs/toolkit';

import { handleErrorMiddleware } from '@/app/store/middleaware';
import productsSlice from '@/app/store/reducers/products';
import userSlice from '@/app/store/reducers/users';
import categoriesSlice from '@/app/store/reducers/categories';

const reducer = {
    usersReducer: userSlice,
    productsReducer: productsSlice,
    categoriesReducer: categoriesSlice,
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
