import { Link } from 'react-router-dom';

import '../index.scss';

export const Login = () => {
    return (
        <>
            <div className="auth__switcher">
                <Link className="auth__switcher__item auth__switcher__item--active" to="/login">
                    Увійти
                </Link>
                <Link className="auth__switcher__item" to="/registration">Реєстрація</Link>
            </div>
            <form className="auth__form">
                <div className="auth__input__wrapper">
                    <label className="auth__label">Електрона пошта</label>
                    <input className="auth__input" />
                    <span></span>
                </div>
                <div className="auth__input__wrapper" >
                    <label className="auth__label">Пароль</label>
                    <input className="auth__input" />
                    <span></span>
                </div>
                <button className="auth__button">Увійти</button>
            </form>
        </>
    );
};