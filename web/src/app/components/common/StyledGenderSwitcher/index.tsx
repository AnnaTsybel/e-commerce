import { Gender } from '@/users';

import './index.scss';

export const StyledGenderSwitcher: React.FC<{
    setGender: React.Dispatch<React.SetStateAction<Gender>>;
    gender: Gender;
}> = ({ setGender, gender }) =>
    <div className="styled-gender-switcher">
        <label className="styled-gender-switcher__title">Ваша стать</label>
        <div className="styled-gender-switcher__items">
            <button
                className={`styled-gender-switcher__item 
                        ${gender === 'woman' && 'styled-gender-switcher__item--active'}`}
                onClick={() => setGender('woman')}
            >
                    Жінка
            </button>
            <button
                className={`styled-gender-switcher__item 
                        ${gender === 'man' && 'styled-gender-switcher__item--active'}`}
                onClick={() => setGender('man')}
            >
                    Чоловік
            </button>
        </div>
    </div>;
