import {
    PayloadAction,
    createSlice,
} from '@reduxjs/toolkit';

/**
 * ErrorState is a representation of slice initialState.
 */
class ErrorState {
    /** class implementation */
    constructor(public errorMessage: string) { }
}

const initialState: ErrorState = {
    errorMessage: '',
};

export const errorReducer = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setErrorMessage(state, action: PayloadAction<string>) {
            state.errorMessage = action.payload;
        },
    },
});

export const { setErrorMessage } = errorReducer.actions;

export default errorReducer.reducer;
