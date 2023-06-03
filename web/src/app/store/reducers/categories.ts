import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Category } from '@/categories';

/** Exposes channels state */
class UsersState {
    /** class implementation */
    constructor(
        public listCategories: Category[] = [],
        public currentCategory: Category = new Category();
    ) { }
}

const initialState: UsersState = {
    listCategories: [],
    currentCategory: new Category(),
};

export const categoriesSlice = createSlice({
    name: 'categoriesReducer',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.listCategories = action.payload;
        },
        setCurrentCategory: (state, action: PayloadAction<Category>) => {
            state.currentCategory = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setCategories, setCurrentCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
