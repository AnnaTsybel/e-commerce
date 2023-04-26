import { useState } from 'react';
import { user } from '../../../mockedData/user';
import userNoPhoto from '@img/no-photo-profile.webp';

import './index.scss';

const User = () => {
    const [isEditing, setIsEditing] = useState(false);

    const sendChanges = () => {
        setIsEditing(false);
    };

    return (
        <div className="user">
            {isEditing
                ? <>
                    <button
                        className="user__edit-button"
                        onClick={() => sendChanges()}
                    >
                        Змінити
                    </button>
                    <div className="user__content">
                        <div className="user__photo__input__wrapper" >
                            <label className="user__photo__label" htmlFor="user-photo">
                                <img
                                    src={user.avatar ? user.avatar : userNoPhoto}
                                    className="user__photo"
                                    alt="user"
                                />
                            </label>
                            <input className="user__photo__input" type="file" id="user-photo"
                                accept="image/png, image/jpeg" />
                            <span>Оберіть нове фото</span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Імʼя</label>
                            <input className="user__input" placeholder={user.name} />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Прізвище</label>
                            <input className="user__input" placeholder={user.surname} />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Пошта</label>
                            <input className="user__input" placeholder={user.email} />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Мобільний</label>
                            <input className="user__input" placeholder={user.phoneNumber} />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Стать</label>
                            <input
                                className="user__input"
                                placeholder={user.gender === 'man' ? 'чоловік' : 'жінка'} />
                            <span></span>
                        </div>
                    </div>
                </>
                : <>
                    <button
                        className="user__edit-button"
                        onClick={() => setIsEditing(true)}
                    >
                        Редагувати
                    </button>
                    <div className="user__content">
                        <img
                            src={user.avatar ? user.avatar : userNoPhoto}
                            className="user__photo"
                            alt="user"
                        />
                        <h1 className="user__name">{user.name} {user.surname}</h1>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Пошта</h3>
                            <p className="user__content__field__info">{user.email}</p>
                        </div>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Мобільний</h3>
                            <p className="user__content__field__info">{user.phoneNumber}</p>
                        </div>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Стать</h3>
                            <p
                                className="user__content__field__info"
                            >
                                {user.gender === 'man' ? 'чоловік' : 'жінка'}
                            </p>
                        </div>
                    </div>
                </>
            }
        </div >
    );
};

export default User;