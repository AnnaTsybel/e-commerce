import { createSlice } from '@reduxjs/toolkit';

import { setCategories, setCurrentCategory, setSubSubCategory } from '../actions/categories';
import { Category, SubCategory, SubSubCategory } from '@/categories';

/** Exposes channels state */
class UsersState {
    /** class implementation */
    constructor(
        public listCategories: Category[] = [],
        public currentCategory: SubCategory[] = [],
        public allSubSubcategories: SubSubCategory[] = []
    ) { }
}

const initialState: UsersState = {
    listCategories: [],
    currentCategory: [],
    allSubSubcategories: [],
};

export const categoriesSlice = createSlice({
    name: 'categoriesReducer',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(setCurrentCategory.fulfilled, (state, action) => {
            state.currentCategory = action.payload;
        });

        builder.addCase(setCategories.fulfilled, (state, action) => ({
            ...state,
            listCategories: action.payload,
        }));
        builder.addCase(setSubSubCategory.fulfilled, (state, action) => ({
            ...state,
            allSubSubcategories: action.payload,
        }));
    },

});

// Action creators are generated for each case reducer function
export const { } = categoriesSlice.actions;

export default categoriesSlice.reducer;
