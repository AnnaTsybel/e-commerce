import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { colors } from '../../../../colors';

import { product } from '../../../../mockedData/product';

import photoAddIcon from '../../../static/img/Product/photo-add-icon.png';
import mockProductPhoto from '../../../static/img/mocked/phone-photo.jpeg';
import closeIcon from '../../../static/img/Product/remove-icon.png';
import backButtonIcon from '../../../static/img/back-button.png';

import '../index.scss';

const MOCK_PRODUCT_PHOTOS
    = [mockProductPhoto, mockProductPhoto, mockProductPhoto, mockProductPhoto];

const ProductCreate = () => {
    const [currentColor, setCurrentColor] = useState('white');
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const deleteProductPhoto = (index: number) => {
        MOCK_PRODUCT_PHOTOS.splice(index, 1);
    };

    return (
        <>
            <Link to="/products" >
                <img src={backButtonIcon} alt="back-button" className="product-edit__back-button" />
            </Link>
            <form className="product-edit">

                <h2 className="product-edit__title">Зміна продукту</h2>
                <div className="product-edit__input__wrapper" >
                    <label className="product-edit__label">Назва</label>
                    <input className="product-edit__input" placeholder={product.title} />
                    <span></span>
                </div>
                <div className="product-edit__input__wrapper" >
                    <label className="product-edit__label">Ціна</label>
                    <input className="product-edit__input" placeholder={`${product.price}`} />
                    <span></span>
                </div>
                <textarea className="product-edit__textarea" placeholder={product.description} />
                <div className="product-edit__color__content">
                    {colors.map((color) =>
                        <div className="product-edit__color__item" key={color}>
                            <div
                                className={`product__${color}__icon 
                                ${currentColor === color ? 'product-edit__color__checked' : ''}`}
                                onClick={() => setCurrentColor(color)} />
                            <p className="product-edit__color__item__text">{color}</p>
                        </div>)}
                </div>

                <div className="product-edit__photos">
                    {product.photo
                        && MOCK_PRODUCT_PHOTOS.map((photo, index) =>
                            <div
                                className="product-edit__photos__item" key={`${photo}-${index}`}
                                onClick={() => deleteProductPhoto(index)}
                            >
                                <span className="product-edit__photos__item__close">
                                    <img
                                        src={closeIcon}
                                        alt="close"
                                        className="product-edit__photos__item__close__icon"
                                    />
                                </span>
                                <img
                                    src={photo}
                                    alt="product"
                                    className="product-edit__photos__item"
                                />
                            </div>
                        )}
                </div>
                <div className="product-edit__photo" >
                    <p>Оберіть фото продукту</p>
                    <label
                        className="product-edit__photo__label"
                        htmlFor="product-photo">
                        <img
                            src={photoAddIcon}
                            alt="add icon"
                            className="product-edit__photo__icon"
                        />
                    </label>
                    <input
                        onChange={handleFileChange}
                        type="file"
                        id="product-photo" name="product-photo"
                        accept="image/png, image/jpeg"
                        className="product-edit__photo__input"
                    />
                </div>
                <button className="product-edit__button">
                    Збрегти зміни
                </button>
            </form>
        </>
    );
};

export default ProductCreate;