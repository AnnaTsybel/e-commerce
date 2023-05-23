import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Color, colors } from '../../../../colors';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';
import { ProductCreation } from '@/product';

import photoAddIcon from '../../../static/img/Product/photo-add-icon.png';
import backButtonIcon from '../../../static/img/back-button.png';

import '../index.scss';

const ProductCreate = () => {
    const [currentColor, setCurrentColor] = useState<Color>(colors[0]);
    const [file, setFile] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(URL.createObjectURL(e.target.files[0]));
        }
    };

    const createProduct = () => {
        productsService.create(new ProductCreation(title,description,price,[file],[currentColor]))
    }

    const onChangePrice =(e:any)=> {
        if (e.target.value) {
            setPrice(e.target.value)
        }
    }

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
                    <input className="product-create__input" onChange={e=>setTitle(e.target.value)} />
                    <span></span>
                </div>
                <div className="product-create__input__wrapper" >
                    <label className="product-create__label">Ціна</label>
                    <input className="product-create__input" type='number' onChange={onChangePrice} />
                    <span></span>
                </div>
                <textarea className="product-create__textarea" placeholder="Опис" onChange={e=>setDescription(e.target.value)} />
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
                <button
                    className="product-create__button"
                    type='button'
                    onClick={() => createProduct()}
                >
                    Створити продукт
                </button>
            </form>
        </>
    );
};

export default ProductCreate;