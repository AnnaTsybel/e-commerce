import { Link } from 'react-router-dom';

import noUserPhoto from '@img/no-photo-profile.webp';
import { useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { catalog } from '@/mockedData/catalog';
import { User } from '@/users';

import './index.scss';

export const Aside = () => {
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    return (
        <aside className="aside">
            <div className="aside__categories">
                {catalog.map((subcategory, index) =>
                    <Link
                        className="aside__category"
                        key={`${subcategory.category}-${index}`}
                        to={`categories/${subcategory.id}`}
                    >
                        {/* <img src={noUserPhoto}
                            alt="category icon"
                            className="aside__category__icon"
                        /> */}
                        <p className="aside__category__text">{subcategory.category}</p>
                    </Link>
                )
                }
            </div>
            {user
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
