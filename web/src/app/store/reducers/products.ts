import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Product } from '@/product'

/** Exposes channels state */
class ProductsState {
    /** class implementation */
    constructor(
        public product: Product = new Product(),
        public products: Product[] = [],
    ) { }
}

const initialState: ProductsState = {
    product: new Product(),
    products: []
}

export const productsSlice = createSlice({
    name: 'productsReducer',
    initialState,
    reducers: {
        list: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { list } = productsSlice.actions

export default productsSlice.reducer