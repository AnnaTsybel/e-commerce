import { toast } from 'react-toastify';

/** Toast notifications themes.
 * Contains colored, light and dark themes.
 */
export enum ToastNotificationsThemes {
    colored = 'colored',
    light = 'light',
    dark = 'dark',
};

/** Toast notifications types.
 * I.e, error, info, success, warning. */
export enum ToastNofiticationsTypes {
    error = 'error',
    info = 'info',
    success = 'success',
    warning = 'warning',
};

/** Defines toast notifications with message, toast type and theme. */
export class ToastNotifications {
    /** Notifies user.
    * As default type uses error type, and default theme is colored. */
    static notify(
        message: string,
        type: ToastNofiticationsTypes = ToastNofiticationsTypes.error,
        theme: ToastNotificationsThemes = ToastNotificationsThemes.colored
    ) {
        toast[type](
            message,
            {
                position: toast.POSITION.TOP_RIGHT,
                theme,
            }
        );
    };

    /** Notifies that something wents wrong agreement. */
    static somethingWentsWrong() {
        this.notify('Something wents wrong');
    };

    /** Notifies that something wents wrong agreement. */
    static couldNotRegisterUser() {
        this.notify('Could not register user! Invalid data.');
    };

    /** Notifies that something wents wrong agreement. */
    static couldNotLoginUser() {
        this.notify('Could not login user! Invalid data.');
    };

    /** Notifies that something wents wrong agreement. */
    static couldNotAddProduct() {
        this.notify('Could not create product! Invalid data.');
    };

    /** Notifies that something wents wrong agreement. */
    static couldNotEditProduct() {
        this.notify('Could not edit product! Invalid data.');
    };
};
