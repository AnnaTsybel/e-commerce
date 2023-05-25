import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/users';

/** Exposes channels state */
class UsersState {
    /** class implementation */
    constructor(
        public user: User = new User(),
    ) { }
}

const initialState: UsersState = {
    user: new User(),
};

export const userSlice = createSlice({
    name: 'usersReducer',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
