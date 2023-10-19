import {
    BadRequestError,
    InternalError,
    NotFoundError,
    UnauthorizedError,
} from '@/api';

/* error code */
const BAD_REQUEST_ERROR = 400;
const UNAUTHORISED_ERROR = 401;
const NOT_FOUND_ERROR = 404;
const INTERNAL_ERROR = 500;

const ERROR_STATUS: { [key: number]: string } = {
    401: 'unauthorized',
    400: 'bad request',
    404: 'not found',
    500: 'internal server error',
};

/* custom hook for error handling*/
export const useHandleError = (errorStatus: string) => {
    switch (errorStatus?.toLocaleLowerCase()) {
    case ERROR_STATUS[BAD_REQUEST_ERROR]:
        throw new BadRequestError();
    case ERROR_STATUS[NOT_FOUND_ERROR]:
        throw new NotFoundError();
    case ERROR_STATUS[UNAUTHORISED_ERROR]:
        throw new UnauthorizedError();
    case ERROR_STATUS[INTERNAL_ERROR]:
    default: throw new InternalError();
    }
};
