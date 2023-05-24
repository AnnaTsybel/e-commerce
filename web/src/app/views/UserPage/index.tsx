import { useEffect, useState } from 'react';

import { Gender, User, UserUpdateData } from '@/users';
import { convertToBase64 } from '@/app/internal/convertImage';
import { getUser, updateUser } from '@/app/store/actions/users';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';

import userNoPhoto from '@img/no-photo-profile.webp';

import './index.scss';

const UserPage = () => {
    const dispatch = useAppDispatch();

    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState<string>();
    const [surname, setSurname] = useState<string>();
    const [phonenumber, setPhonenumber] = useState<string>();
    const [gender, setGender] = useState<Gender>();
    const [photo, setPhoto] = useState<string>(userNoPhoto)
    const [file, setFile] = useState<string>(userNoPhoto)

    const handleFileChange = async (e: any) => {
        if (e.target.files?.length) {
            setPhoto(URL.createObjectURL(e.target.files[0]));
            const convertedFile: string = await convertToBase64(e.target.files[0]);
            setFile(convertedFile)
        }
    }

    const sendChanges = () => {
        setIsEditing(false);

        dispatch(updateUser(new UserUpdateData(
            user.id,
            name,
            surname,
            phonenumber,
            gender
        )))
    };

    useEffect(() => {
        dispatch(getUser())
    }, []);

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
                                    src={photo}
                                    className="user__photo"
                                    alt="user"
                                />
                            </label>
                            <input
                                className="user__photo__input"
                                type="file"
                                id="user-photo"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                            />
                            <span>Оберіть нове фото</span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Імʼя</label>
                            <input
                                className="user__input"
                                defaultValue={user.name}
                                onChange={e => setName(e.target.value)}
                            />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Прізвище</label>
                            <input
                                className="user__input"
                                defaultValue={user.surname}
                                onChange={e => setSurname(e.target.value)}
                            />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label className="user__label">Мобільний</label>
                            <input
                                className="user__input"
                                defaultValue={user.phoneNumber}
                                onChange={e => setPhonenumber(e.target.value)}
                            />
                            <span></span>
                        </div>
                        <div className="user__input__wrapper" >
                            <label
                                className="user__label">Стать</label>
                            <input
                                className="user__input"
                                defaultValue={user.gender === 'man' ? 'чоловік' : 'жінка'}
                                onChange={e => setName(e.target.value)}
                            />
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

export default UserPage;
