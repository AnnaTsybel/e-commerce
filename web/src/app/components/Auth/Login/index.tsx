import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { StyledInput } from '@components/common/StyledInput';

import { UsersClient } from '@/api/users';
import { RouteConfig } from '@app/routes';
import { UsersService } from '@/users/service';

import '../index.scss';

export const Login = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const usersClient = new UsersClient();
    const usersService = new UsersService(usersClient);

    const login = async() => {
        if (password && email) {
            await usersService.login(email, password);
            window.localStorage.setItem('IS_LOGGEDIN', JSON.stringify(true));
            navigate(RouteConfig.Home.path);
        }
    };

    return (
        <>
            <div className="auth__switcher">
                <Link className="auth__switcher__item auth__switcher__item--active" to="/login">
                    Увійти
                </Link>
                <Link className="auth__switcher__item" to="/registration">Реєстрація</Link>
            </div>
            <form className="auth__form">
                <StyledInput
                    title="Електрона пошта"
                    onChange={e => setEmail(e.target.value)}
                    required={true}
                    value={email}
                    type="email"
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
                    onClick={() => login()}
                >
                    Увійти
                </button>
            </form>
        </>
    );
};
