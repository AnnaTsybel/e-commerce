import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Product, ProductEdit } from '@/product';
import { ProductsService } from '@/product/service';
import { ProductsClient } from '@/api/products';
import { Color, colors } from '@/colors';

import photoAddIcon from '@img/Product/photo-add-icon.png';
import mockProductPhoto from '@img/mocked/phone-photo.jpeg';
import closeIcon from '@img/Product/remove-icon.png';
import backButtonIcon from '@img/back-button.png';

import '../index.scss';
import { convertToBase64 } from '@/app/internal/convertImage';

const MOCK_PRODUCT_PHOTOS
    = [mockProductPhoto, mockProductPhoto, mockProductPhoto, mockProductPhoto];

const DEFAULT_COLOR_INDEX = 0;
const DEFAULT_PRICE = 0;
const FIRST_PHOTO_INDEX = 0;
const LAST_ITEM_PATH_INCREMENT = 1;
const DELETE_PRODUCT_PHOTO_NUMBER = 1;

const ProductCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + LAST_ITEM_PATH_INCREMENT);

    const [files, setFiles] = useState<string[]>();

    const [currentColor, setCurrentColor] = useState<Color>(colors[DEFAULT_COLOR_INDEX]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(DEFAULT_PRICE);
    const [photos, setPhotos] = useState<string[]>();

    const [product, setProduct] = useState<Product>();

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            let photosData = [];
            let filesData = [];

            const uploadedFiles = Array.from(e.target.files);

            for await (const uploadedFile of uploadedFiles) {
                photosData.push(URL.createObjectURL(uploadedFile))

                const convertedFile: string = await convertToBase64(uploadedFile);
                filesData.push(convertedFile)
            }

            setPhotos(photosData);
            setFiles(filesData)
        }
    };

    const onChangePrice = (e: any) => {
        if (e.target.value) {
            setPrice(Number(e.target.value));
        }
    };

    const deleteProductPhoto = (index: number) => {
        MOCK_PRODUCT_PHOTOS.splice(index, DELETE_PRODUCT_PHOTO_NUMBER);
    };

    const setProductData = async() => {
        const currentPath = getLastItem(location.pathname);

        const productData = await productsService.product(currentPath);
        setProduct(productData);

        setTitle(productData.title);
        setPrice(productData.price);
        setDescription(productData.description);
        setCurrentColor(productData.color[DEFAULT_COLOR_INDEX]);
    };

    const editProduct = async() => {
        if (product) {
            await productsService.update(
                new ProductEdit(
                    product.id,
                    title,
                    description,
                    price,
                    product.isAvailable,
                    [currentColor],
                    product.IsLiked
                ));
            navigate(`/product/${product.id}`);
        }
    };

    useEffect(() => {
        setProductData();
    }, []);

    return (
        <>
            <Link to="/products" >
                <img src={backButtonIcon} alt="back-button" className="product-edit__back-button" />
            </Link>
            {product &&
                <form className="product-edit">

                    <h2 className="product-edit__title">Зміна продукту</h2>
                    <div className="product-edit__input__wrapper" >
                        <label className="product-edit__label">Назва</label>
                        <input
                            className="product-edit__input"
                            defaultValue={product.title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <span></span>
                    </div>
                    <div className="product-edit__input__wrapper" >
                        <label className="product-edit__label">Ціна</label>
                        <input
                            className="product-edit__input"
                            defaultValue={`${product.price}`}
                            onChange={onChangePrice} />
                        <span></span>
                    </div>
                    <textarea
                        className="product-edit__textarea"
                        defaultValue={product.description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <div className="product-edit__color__content">
                        {colors.map((color) =>
                            <div className="product-edit__color__item" key={color}>
                                <div
                                    className={`product__color__icon product__${color}__icon 
                                ${currentColor === color ? 'product-edit__color__checked' : ''}`}
                                    onClick={() => setCurrentColor(color)} />
                                <p className="product-edit__color__item__text">{color}</p>
                            </div>)}
                    </div>

                    <div className="product-edit__photos">
                        {product.photos
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
                            multiple
                            hidden
                        />
                    </div>
                    <button
                        className="product-edit__button"
                        type="button"
                        onClick={() => editProduct()}
                    >
                        Збрегти зміни
                    </button>
                </form>
            }
        </>
    );
};

export default ProductCreate;
