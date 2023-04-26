import { useNavigate } from 'react-router-dom';

import { RouteConfig } from '@/routes/index';

import './index.scss';

const NotFoundPage = () => {
    const navigate = useNavigate();

    /** Redirects to home page. */
    const backToHomePage = () => {
        navigate(RouteConfig.Home.path);
    };

    return (
        <section className="not-found">
            <h1 className="not-found__title">
                4<span>0</span>4
            </h1>
            <h3 className="not-found__subtitle">
                Сторінку не знайдено
            </h3>
            <button onClick={backToHomePage} className="not-found__button">Домашня сторінка</button>
        </section>
    );
};

export default NotFoundPage;