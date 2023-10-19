import { Middleware, MiddlewareAPI } from 'redux';

import { setErrorMessage } from '@/app/store/reducers/error';
import { useHandleError } from '@/app/hooks/useHandleErrors';

/** Handle action error middleware. */
export const handleErrorMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (action.error) {
            api.dispatch(setErrorMessage(action.error.message));
            useHandleError(action.error.message);
        } else {
            next(action);
        }
    };
