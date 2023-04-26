import { Link } from 'react-router-dom';

import { catalog } from '@/mockedData/catalog';
import { user } from '@/mockedData/user';

import noUserPhoto from '@img/no-photo-profile.webp';

import './index.scss';

export const Aside = () => {

    const isLoggedIn = true;

    return (
        <aside className="aside">
            <div className="aside__categories">
                {catalog.map((subcategory, index) =>
                    <Link
                        className="aside__category"
                        key={`${subcategory.category}-${index}`}
                        to={`categories/${subcategory.id}`}
                    >
                        <img src={noUserPhoto}
                            alt="category icon"
                            className="aside__category__icon"
                        />
                        <p className="aside__category__text">{subcategory.category}</p>
                    </Link>
                )
                }
                <Link
                    className="aside__category"
                    to="/categories"
                >
                    <img src={noUserPhoto} alt="category icon" className="aside__category__icon" />
                    <p className="aside__category__text">Всі категорії</p>
                </Link>
            </div>
            {isLoggedIn
                && <div className="aside__user">
                    <Link className="aside__user__info" to={`user/${user.id}`}>
                        <img src={user.avatar ? user.avatar : noUserPhoto}
                            alt="user"
                            className="aside__user__info__photo" />
                        <div>
                            <p className="aside__user__info__name">{user.name} {user.surname}</p>
                            <p className="aside__user__info__email">{user.email}</p>
                        </div>
                    </Link>
                </div>
            }

        </aside>
    );
};