import { User } from '@/users';


export const getUserAge = (user: User) => {
    const CHECK_IS_VALUE_TWO_DIGIT = 10;
    const CONVERT_MONTH_VALUE = 1;

    const date = new Date(user.dateOfBirth);

    const month = date.getMonth() + CONVERT_MONTH_VALUE;
    const year = date.getFullYear();
    const day = date.getDate();

    const convertedDate = `${month < CHECK_IS_VALUE_TWO_DIGIT ? `0${month}` : month}.${day < CHECK_IS_VALUE_TWO_DIGIT ? `0${day}` : day}.${year}`;

    return convertedDate;
};
