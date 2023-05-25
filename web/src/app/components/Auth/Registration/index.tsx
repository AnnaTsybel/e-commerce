import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RouteConfig } from '@/routes';
import { UserRegisterData } from '@/users';
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

    const registerUser = () => {
        dispatch(register(new UserRegisterData(
            name,
            surname,
            phoneNumber,
            email,
            'man',
            password
        )));

        window.localStorage.setItem('IS_LOGGEDIN', JSON.stringify(true));

        dispatch(getUser());

        navigate(RouteConfig.Home.path);
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
                <div className="auth__input__wrapper">
                    <label className="auth__label">Імʼя</label>
                    <input
                        className="auth__input"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper">
                    <label className="auth__label">Прізвище</label>
                    <input
                        className="auth__input"
                        onChange={e => setSurname(e.target.value)}
                        required
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper">
                    <label className="auth__label">Електрона пошта</label>
                    <input
                        className="auth__input"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper" >
                    <label className="auth__label">Мобільний номер</label>
                    <input
                        className="auth__input"
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper" >
                    <label className="auth__label">Пароль</label>
                    <input
                        className="auth__input"
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        required
                    />
                    <span></span>
                </div>
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
