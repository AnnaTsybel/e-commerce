import { useEffect, useState } from 'react';
import userNoPhoto from '@img/no-photo-profile.webp';

import './index.scss';
import { UsersClient } from '@/api/users';
import { UsersService } from '@/users/service';
import { Gender, User, UserUpdateData } from '@/users';
import { convertToBase64 } from '@/app/internal/convertImage';

const UserPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<User>();

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

    const usersClient = new UsersClient();
    const usersService = new UsersService(usersClient);

    const sendChanges = () => {
        setIsEditing(false);
        if (user) {
            usersService.update(new UserUpdateData(user.id, name, surname, phonenumber, gender));
        }
    };

    useEffect(() => {
        (async function setClub() {
            const userData = await usersService.getUser();
            setUser(userData);

            setName(userData.name);
            setSurname(userData.surname);
            setGender(userData.gender);
            setPhonenumber(userData.phoneNumber);
        }());
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
                    {user &&
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
                    }
                </>
                : <>

                    <button
                        className="user__edit-button"
                        onClick={() => setIsEditing(true)}
                    >
                        Редагувати
                    </button>
                    {user &&
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
                    }
                </>
            }
        </div >
    );
};

export default UserPage;
