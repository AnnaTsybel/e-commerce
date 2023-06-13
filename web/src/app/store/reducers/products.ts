import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { deleteProductData, getListByCategory, getProduct, getRecommendationForHomePage, productRecommendation, searchProducts } from '@/app/store/actions/products';
import { Product } from '@/product';

/** Exposes channels state */
class ProductsState {
    /** class implementation */
    constructor(
        public currentProduct: Product = new Product(),
        public products: Product[] = [],
        public productPhotos: string[] = [],
        public productRecomendation: Product[] = [],
        public productRecommendationForHome: Product[] = [],
        public foundedProducts: Product[] = [],
        public loading: 'idle' | 'pending' | 'succeeded' | 'failed' = 'idle'
    ) { }
}

const initialState: ProductsState = {
    currentProduct: new Product(),
    products: [],
    productPhotos: [],
    productRecomendation: [],
    productRecommendationForHome: [],
    foundedProducts: [],
    loading: 'idle',
};

export const productsSlice = createSlice({
    name: 'productsReducer',
    initialState,
    reducers: {

        setProductPhotos: (state, action: PayloadAction<string[] | []>) => {
            state.productPhotos =
                action.payload;
        },

        deleteProductPhoto: (state, action: PayloadAction<string>) => ({
            ...state,
            productPhotos: state.productPhotos.filter((photo) => photo !== action.payload),
        }),
        addProductPhotos: (state, action: PayloadAction<string[]>) => ({
            ...state,
            productPhoto: state.productPhotos.concat(action.payload),
        }),
        deleteProductPhotos: (state) => {
            state.productPhotos = [];
        },
        getProductRecomedation: (state, action: PayloadAction<Product[]>) => {
            state.productRecomendation = action.payload;
        },
        getRecomedationForHomePage: (state, action: PayloadAction<Product[]>) => {
            state.productRecommendationForHome = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getProduct.fulfilled, (state, action) => {
            state.currentProduct = action.payload;
        });

        builder.addCase(deleteProductData.fulfilled, (state, action) => ({
            ...state,
            products: state.products.filter((product) => product.id !== action.payload),
        }));

        builder.addCase(getListByCategory.fulfilled, (state, action) => ({
            ...state,
            products: action.payload,
        }));

        builder.addCase(productRecommendation.fulfilled, (state, action) => ({
            ...state,
            productRecomendation: action.payload,
        }));

        builder.addCase(getRecommendationForHomePage.fulfilled, (state, action) => ({
            ...state,
            productRecommendationForHome: action.payload,
        }));

        builder.addCase(searchProducts.fulfilled, (state, action) => {
            state.foundedProducts = action.payload;
        });
    },
});

// Action creators are generated for each case reducer function
export const { setProductPhotos, deleteProductPhoto, addProductPhotos, deleteProductPhotos, getRecomedationForHomePage } = productsSlice.actions;

export default productsSlice.reducer;
