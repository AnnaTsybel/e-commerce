import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/users';
import { Product } from '@/product';

const DEFAULT_AMOUNT_LIKED_PRODUCTS = 0;

/** Exposes channels state */
class UsersState {
    /** class implementation */
    constructor(
        public user: User = new User(),
        public likedProducts: Product[] = [],
        public amountOfLikedProducts: number = DEFAULT_AMOUNT_LIKED_PRODUCTS
    ) { }
}

const initialState: UsersState = {
    user: new User(),
    likedProducts: [],
    amountOfLikedProducts: DEFAULT_AMOUNT_LIKED_PRODUCTS,
};

export const userSlice = createSlice({
    name: 'usersReducer',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setLikedProducts: (state, action: PayloadAction<Product[]>) => {
            state.likedProducts = action.payload;
        },
        setAmountOfLikedProducts: (state, action: PayloadAction<number>) => {
            state.amountOfLikedProducts = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
