import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import userNoPhoto from '@img/no-photo-profile.webp';
import { useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { catalog } from '@/mockedData/catalog';
import { User } from '@/users';

import './index.scss';

export const Aside = () => {
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const [photo, setPhoto] = useState<string>();
    const [isAvatarExists, setIsAvatarExists] = useState<boolean>();

    const setUserAvatar = () => {
        isAvatarExists ? setPhoto(`${window.location.origin}/images/users/${user.id}.png`) : setPhoto(userNoPhoto);
    };

    useEffect(() => {
        setIsAvatarExists(user.isAvatarExists);
        setUserAvatar();
    }, [user]);

    return (
        <aside className="aside">
            <div className="aside__categories">
                {catalog.map((category, index) =>
                    <Link
                        className="aside__category"
                        key={`${category.category}-${index}`}
                        to={`category/${category.id}`}
                    >
                        <p className="aside__category__text">{category.category}</p>
                    </Link>
                )
                }
            </div>
            {user
                && <div className="aside__user">
                    <Link className="aside__user__info" to={`user/${user.id}`}>
                        <img src={photo}
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
