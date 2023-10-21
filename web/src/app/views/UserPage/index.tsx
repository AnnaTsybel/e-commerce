import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import userNoPhoto from '@img/no-photo-profile.webp';
import { AuthRoutesConfig } from '@app/routes';
import { Gender, User, UserUpdateData } from '@/users';
import { convertToBase64 } from '@/app/internal/convertImage';
import { getUser, logout, updateUser } from '@/app/store/actions/users';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { getUserAge } from '@/app/internal/getUserAge';
import { ToastNotifications } from '@/notifications/service';

import './index.scss';
import { StyledInput } from '@app/components/common/StyledInput';
import { StyledGenderSwitcher } from '@app/components/common/StyledGenderSwitcher';

const PHOTO_INDEX = 0;
const SECOND_INDEX = 1;

const UserPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [phonenumber, setPhonenumber] = useState<string>('');
    const [gender, setGender] = useState<Gender>('');
    const [photo, setPhoto] = useState<string>('');
    const [file, setFile] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    const [convertedDateOfBirth, setConvertedDateOfBirth] = useState<string>('');
    const [isAvatarExists, setIsAvatarExists] = useState<boolean>(false);

    const handleFileChange = async(e: any) => {
        if (e.target.files?.length) {
            setPhoto(URL.createObjectURL(e.target.files[PHOTO_INDEX]));
            const convertedFile: string = await convertToBase64(e.target.files[PHOTO_INDEX]);
            setFile(convertedFile.split(',')[SECOND_INDEX]);
        }
    };

    const setDateOfBirthConverted = (date: string) => new Date(date).toISOString();

    const setUserAge = (dateOfBirthUser: string) => {
        const age = getUserAge(dateOfBirthUser);

        setConvertedDateOfBirth(age);
    };

    const sendChanges = () => {
        setIsEditing(false);
        const convertedDateOfBirth = setDateOfBirthConverted(dateOfBirth);

        dispatch(updateUser(new UserUpdateData(
            user.id,
            name,
            surname,
            phonenumber,
            email,
            file,
            gender,
            user.createdAt,
            convertedDateOfBirth,
            user.passwordHash
        )));

        if (dateOfBirth) {
            setUserAge(dateOfBirth);
        }
    };

    const logoutUser = async() => {
        try {
            await dispatch(logout());

            navigate(AuthRoutesConfig.Registration.path);
        }
        catch {
            ToastNotifications.somethingWentsWrong();
        }
    };

    const setUserAvatar = () => {
        isAvatarExists ? setPhoto(`${window.location.origin}/images/users/${user.id}.png`) : setPhoto(userNoPhoto);
    };

    useEffect(() => {
        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
        setIsAvatarExists(user.isAvatarExists);
        setPhonenumber(user.phoneNumber);
        setGender(user.gender);
        setDateOfBirth(user.dateOfBirth);
        setUserAge(user.dateOfBirth);
        setUserAvatar();
    }, [user]);

    useEffect(() => {
        dispatch(getUser());
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
                        <StyledInput
                            title="Імʼя"
                            onChange={e => setName(e.target.value)}
                            required={true}
                            value={name}
                        />
                        <StyledInput
                            title="Прізвище"
                            onChange={e => setSurname(e.target.value)}
                            required={true}
                            value={surname}
                        />
                        <StyledInput
                            title="Прізвище"
                            onChange={e => setEmail(e.target.value)}
                            required={true}
                            value={email}
                            type="email"
                        />
                        <StyledInput
                            title="Прізвище"
                            onChange={e => setPhonenumber(e.target.value)}
                            required={true}
                            value={phonenumber}
                        />
                        <StyledInput
                            title="Дата народження"
                            onChange={e => setDateOfBirth(e.target.value)}
                            required={true}
                            value={dateOfBirth}
                            type="email"
                        />
                        <StyledGenderSwitcher gender={gender} setGender={setGender} />
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
                            src={photo}
                            className="user__photo"
                            alt="user"
                        />
                        <h1 className="user__name">{name} {surname}</h1>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Пошта</h3>
                            <p className="user__content__field__info">{email}</p>
                        </div>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Мобільний</h3>
                            <p className="user__content__field__info">{phonenumber}</p>
                        </div>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Дата народження</h3>
                            <p className="user__content__field__info">{convertedDateOfBirth}</p>
                        </div>
                        <div className="user__content__field">
                            <h3 className="user__content__field__name">Стать</h3>
                            <p
                                className="user__content__field__info"
                            >
                                {gender === 'man' ? 'чоловік' : 'жінка'}
                            </p>
                        </div>
                    </div>
                    <button className="user__logout" onClick={() => logoutUser()}>
                        Вийти з акаунту
                    </button>
                </>
            }
        </div>
    );
};

export default UserPage;
