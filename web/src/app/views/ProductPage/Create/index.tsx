import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Color, colors } from '../../../../colors';
import photoAddIcon from '../../../static/img/Product/photo-add-icon.png';
import backButtonIcon from '../../../static/img/back-button.png';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';
import { ProductCreation } from '@/product';

import '../index.scss';

const DEFAULT_COLOR_INDEX = 0;
const DEFAULT_PRICE = 0;
const FIRST_PHOTO_INDEX = 0;

const ProductCreate = () => {
    const navigate=useNavigate();
    const [currentColor, setCurrentColor] = useState<Color>(colors[DEFAULT_COLOR_INDEX]);
    const [file, setFile] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(DEFAULT_PRICE);

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(URL.createObjectURL(e.target.files[FIRST_PHOTO_INDEX]));
        }
    };

    const createProduct = () => {
        productsService.create(new ProductCreation(title, description, price, [file], [currentColor]));
        navigate('/products');
    };

    const onChangePrice =(e:any) => {
        if (e.target.value) {
            setPrice(Number(e.target.value));
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
                    <input className="product-create__input" onChange={e => setTitle(e.target.value)} />
                    <span></span>
                </div>
                <div className="product-create__input__wrapper" >
                    <label className="product-create__label">Ціна</label>
                    <input
                        className="product-create__input"
                        type="number"
                        onChange={onChangePrice}
                    />
                    <span></span>
                </div>
                <textarea
                    className="product-create__textarea"
                    placeholder="Опис"
                    onChange={e => setDescription(e.target.value)}
                />
                <div className="product-create__color__content">
                    {colors.map((color) =>
                        <div className="product-create__color__item" key={color}>
                            <div
                                className={`product__color__icon product__${color}__icon 
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
                <button
                    className="product-create__button"
                    type="button"
                    onClick={() => createProduct()}
                >
                    Створити продукт
                </button>
            </form>
        </>
    );
};

export default ProductCreate;
