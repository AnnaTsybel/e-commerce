import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { StyledInput } from '@components/common/StyledInput';
import { StyledGenderSwitcher } from '@components/common/StyledGenderSwitcher';

import { Gender, UserRegisterData } from '@/users';
import { ToastNotifications } from '@/notifications/service';
import { RouteConfig } from '@app/routes';
import { useAppDispatch } from '@/app/hooks/useReduxToolkit';
import { getUser, register } from '@/app/store/actions/users';

import '../index.scss';

export const Registration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<Gender>('man');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');

    const setDateOfBirthConverted = (date: string) => new Date(date).toISOString();

    const registerUser = async() => {
        try {
            const convertedDateOfBirth = setDateOfBirthConverted(dateOfBirth);

            await dispatch(register(new UserRegisterData(
                name,
                surname,
                phoneNumber,
                email,
                gender,
                password,
                convertedDateOfBirth
            )));

            window.localStorage.setItem('IS_LOGGEDIN', JSON.stringify(true));

            await dispatch(getUser());

            navigate(RouteConfig.Home.path);
        }
        catch (e) {
            ToastNotifications.couldNotRegisterUser();
        }
    };

    return (
        <>
            <div className="auth__switcher">
                <Link className="auth__switcher__item" to="/login">Увійти</Link>
                <Link
                    className="auth__switcher__item auth__switcher__item--active"
                    to="/registration"
                >
                    Реєстрація
                </Link>
            </div>
            <form className="auth__form">
                <StyledInput
                    title="Імʼя"
                    onChange={e => setName(e.target.value)}
                    required={true}
                    value={name}
                />
                <StyledInput
                    title="Прізвище"
                    onChange={e => setSurname(e.target.value)}
                    required={true}
                    value={surname}
                />
                <StyledInput
                    title="Електрона пошта"
                    onChange={e => setEmail(e.target.value)}
                    required={true}
                    value={email}
                    type="email"
                />
                <StyledInput
                    title="Номер телефону"
                    onChange={e => setPhoneNumber(e.target.value)}
                    required={true}
                    value={phoneNumber}
                    type="text"
                />
                <StyledInput
                    title="День народження"
                    onChange={e => setDateOfBirth(e.target.value)}
                    required={true}
                    value={dateOfBirth}
                    type="date"
                />
                <StyledGenderSwitcher
                    gender={gender}
                    setGender={setGender}
                />
                <StyledInput
                    title="Пароль"
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                    value={password}
                    type="password"
                />
                <button
                    className="auth__button"
                    type="button"
                    onClick={() => registerUser()}
                >
                    Реєстрація
                </button>
            </form>
        </>
    );
};
