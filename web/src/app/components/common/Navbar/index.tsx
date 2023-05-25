import { Link } from 'react-router-dom';
import { useState } from 'react';

import Catalog from '@components/Catalog';

import userProfileIcon from '@img/Navbar/user-icon.png';
import catalogIcon from '@img/Navbar/catalog-icon.png';
import favoriteIcon from '@img/Navbar/not-favorite-icon.png';
import searchIcon from '@img/Navbar/search-icon.png';
import сancelIcon from '@img/Navbar/cancel-icon.png';
import logoIcon from '@img/Navbar/logo.png';
import { User } from '@/users';
import { RouteConfig } from '@/routes';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks/useReduxToolkit';

import { catalog } from '@/mockedData/catalog';

import './index.scss';

const ITEMS_SHOPPING_CART_AMOUNT = 12;

export const Navbar = () => {
    const [isCatalogOpened, setCatalogOpened] = useState<boolean>(false);

    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    return (
        <header className="header">
            <div className="header__content">
                <Link className="header__logo" to={RouteConfig.Home.path}>
                    <img className="header__logo__image" src={logoIcon} alt="logo icon" />
                </Link>
                <div className="header__catalog" onClick={() => setCatalogOpened(!isCatalogOpened)}>
                    <div className="header__catalog__icon">
                        {isCatalogOpened
                            ? <img className="header__catalog__icon__image"
                                src={сancelIcon} alt="cancel icon" />
                            : <img className="header__catalog__icon__image"
                                src={catalogIcon} alt="catalog icon" />}
                    </div>
                    <p className="header__catalog__text">Каталог</p>
                </div>
                <div className="header__search">
                    <label htmlFor="search" className="header__search__label">
                        <img className="header__search__icon" src={searchIcon} alt="search icon" />
                    </label>
                    <input className="header__search__input"
                        id="search" type="text" placeholder="Я шукаю..." />
                    <button className="header__search__button" >
                        Знайти
                    </button>
                </div>
                <Link className="header__user" to={`/user/${user.id}`}>
                    <div className="header__user__icon">
                        <img src={userProfileIcon}
                            alt="user profile"
                            className="header__user__icon__image" />
                    </div>
                    <p className="header__user__text">{user.name} {user.surname}</p>
                </Link>
                <div className="header__shopping-cart">
                    <Link to="/products/favorite" className="header__shopping-cart__icon">
                        <img src={favoriteIcon}
                            alt="shopping cart"
                            className="header__shopping-cart__image" />
                    </Link>
                    <span className="header__shopping-cart__active">
                        {ITEMS_SHOPPING_CART_AMOUNT}
                    </span>
                </div>
            </div>
            {isCatalogOpened
                && <Catalog catalog={catalog} setCatalogOpened={setCatalogOpened} />
            }
        </header>
    );
};
