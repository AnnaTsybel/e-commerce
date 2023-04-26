import { Link } from 'react-router-dom';

import { RouteConfig } from '../../../routes';

import authPageBg from '@img/Auth/registration-bg.jpg';
import homeIcon from '@img/Auth/home-icon.png';

import './index.scss';

const Auth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    return (
        <div className="auth">
            <Link to={RouteConfig.Home.path} className="auth__gohome-button">
                <img src={homeIcon} alt="go to home page" className="auth__gohome-button__image" />
            </Link>
            <div className="auth__container">

                <div className="auth__info">
                    {children}
                </div>
                <div className="auth__bg" >
                    <img src={authPageBg} alt="auth bg" className="auth__bg__image" />
                </div>
            </div>
        </div>
    );
};

export default Auth;