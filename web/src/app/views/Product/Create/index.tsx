import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { colors } from '../../../../colors';

import photoAddIcon from '../../../static/img/Product/photo-add-icon.png';
import backButtonIcon from '../../../static/img/back-button.png';

import '../index.scss';

const ProductCreate = () => {
    const [currentColor, setCurrentColor] = useState(colors[0]);
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <Link to="/products">
                <img src={backButtonIcon}
                    alt="back-button"
                    className="product-create__back-button" />
            </Link>
            <form className="product-create">
                <h2 className="product-create__title">Створення продукту</h2>
                <div className="product-create__input__wrapper" >
                    <label className="product-create__label">Назва</label>
                    <input className="product-create__input" />
                    <span></span>
                </div>
                <div className="product-create__input__wrapper" >
                    <label className="product-create__label">Ціна</label>
                    <input className="product-create__input" />
                    <span></span>
                </div>
                <textarea className="product-create__textarea" placeholder="Опис" />
                <div className="product-create__color__content">
                    {colors.map((color) =>
                        <div className="product-create__color__item" key={color}>
                            <div
                                className={`product__${color}__icon 
                                ${currentColor === color ? 'product-create__color__checked' : ''}`}
                                onClick={() => setCurrentColor(color)} />
                            <p className="product-create__color__item__text">{color}</p>
                        </div>)}
                </div>
                <div className="product-create__photo" >
                    <p>Оберіть фото продукту</p>
                    <label className="product-create__photo__label"
                        htmlFor="product-photo">
                        <img
                            src={photoAddIcon}
                            alt="add icon"
                            className="product-create__photo__icon"
                        />
                    </label>
                    <input
                        onChange={handleFileChange}
                        type="file"
                        id="product-photo" name="product-photo"
                        accept="image/png, image/jpeg"
                        className="product-create__photo__input"
                    />
                </div>
                <button className="product-create__button">
                    Створити продукт
                </button>
            </form>
        </>
    );
};

export default ProductCreate;