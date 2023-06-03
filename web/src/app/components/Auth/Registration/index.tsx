import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RouteConfig } from '@/routes';
import { Gender, UserRegisterData } from '@/users';
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

    const setDateOfBirthConverted = (date: string) => {
        const convertedDate = new Date(date).toISOString();
        setDateOfBirth(convertedDate);
    };

    const registerUser = async () => {
        try {
            await dispatch(register(new UserRegisterData(
                name,
                surname,
                phoneNumber,
                email,
                'man',
                password,
                dateOfBirth
            )));

            await window.localStorage.setItem('IS_LOGGEDIN', JSON.stringify(true));

            await dispatch(getUser());

            await navigate(RouteConfig.Home.path);
        }
        catch (e) {
            /** TODO: add catching error */
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
                <div className="auth__input__wrapper">
                    <label className="auth__label">Імʼя</label>
                    <input
                        className="auth__input"
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper">
                    <label className="auth__label">Прізвище</label>
                    <input
                        className="auth__input"
                        onChange={e => setSurname(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <span></span>
                </div>
                <div className="auth__input__wrapper">
                    <label className="auth__label">Електрона пошта</label>
                    <input
                        className="auth__input"
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        type="email"
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
                    <label className="auth__label">День народження</label>
                    <input
                        className="auth__input"
                        onChange={e => setDateOfBirthConverted(e.target.value)}
                        type="date"
                        required
                    />
                    <span></span>
                </div>
                <div className="auth__gender__wrapper" >
                    <label className="auth__gender__title">Ваша стать</label>
                    <div className="auth__gender">
                        <div
                            className={`auth__gender__item ${gender === 'woman' && 'auth__gender__item--active'}`}
                            onClick={() => setGender('woman')}
                        >
                            Жінка
                        </div>
                        <div
                            className={`auth__gender__item ${gender === 'man' && 'auth__gender__item--active'}`}
                            onClick={() => setGender('man')}>
                            Чоловік
                        </div>
                    </div>
                </div>
                <div className="auth__input__wrapper" >
                    <label className="auth__label">Пароль</label>
                    <input
                        className="auth__input"
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        required
                        autoComplete="off"
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
