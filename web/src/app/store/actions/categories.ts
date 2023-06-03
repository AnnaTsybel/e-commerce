import { Dispatch } from 'redux';

import { categoriesSlice } from '../reducers/categories';
import { BadRequestError } from '@/api';
import { setErrorMessage } from '@/app/store/reducers/error';
import { CategoriesClient } from '@/api/categories';
import { CategoriesService } from '@/categories/service';

const categoriesClient = new CategoriesClient();
export const categoriesService = new CategoriesService(categoriesClient);

export const setCategories = () => async function(dispatch: Dispatch) {
    try {
        const categories = await categoriesService.listCategories();
        dispatch(categoriesSlice.actions.setCategories(categories));
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            dispatch(setErrorMessage('No valid user info'));
        }
    }
};
