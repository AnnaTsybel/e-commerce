import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { deleteProductData, getProduct, productsList } from '../actions/products';
import { Product } from '@/product';

/** Exposes channels state */
class ProductsState {
    /** class implementation */
    constructor(
        public currentProduct: Product = new Product(),
        public products: Product[] = [],
        public productPhotos: string[] = [],
        public loading: 'idle' | 'pending' | 'succeeded' | 'failed' = 'idle'
    ) { }
}

const initialState: ProductsState = {
    currentProduct: new Product(),
    products: [],
    productPhotos: [],
    loading: 'idle',
};

export const productsSlice = createSlice({
    name: 'productsReducer',
    initialState,
    reducers: {
        list: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },

        setProductPhotos: (state, action: PayloadAction<string[] | []>) => {
            state.productPhotos =
                action.payload;
        },

        deleteProductPhoto: (state, action: PayloadAction<string>) => {
            state.productPhotos =
                state.productPhotos.filter((photo) => photo !== action.payload);
        },
        addProductPhotos: (state, action: PayloadAction<string[]>) => {
            state.productPhotos =
                state.productPhotos.concat(action.payload);
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getProduct.fulfilled, (state, action) => {
            state.currentProduct = action.payload;
        });

        builder.addCase(deleteProductData.fulfilled, (state, action) => {
            state.products = state.products.filter((product) => product.id !== action.payload);
        });
    },
});

// Action creators are generated for each case reducer function
export const { list, setProductPhotos, deleteProductPhoto, addProductPhotos } = productsSlice.actions;

export default productsSlice.reducer;
