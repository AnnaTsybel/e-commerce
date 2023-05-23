// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { usersReducer } from './reducers/users';

const reducer = combineReducers({
    usersReducer,
});

export const store = createStore(reducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
