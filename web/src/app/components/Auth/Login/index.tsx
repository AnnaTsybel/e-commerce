import { UsersClient } from '@/api/users';
import { RouteConfig } from '@/routes';
import { UsersService } from '@/users/service';
import { Link, useNavigate } from 'react-router-dom';

import '../index.scss';

export const Login = () => {
    const navigate = useNavigate()
    
    const usersClient = new UsersClient();
    const usersService = new UsersService(usersClient);

    const login = async () => {
        // await usersService.login()
        navigate(RouteConfig.Home.path)

    }
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
                <button className="auth__button" type='button' onClick={()=>login()}>Увійти</button>
            </form>
        </>
    );
};