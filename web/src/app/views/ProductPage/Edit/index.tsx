import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import photoAddIcon from '@img/Product/photo-add-icon.png';
import closeIcon from '@img/Product/remove-icon.png';
import backButtonIcon from '@img/back-button.png';
import { Product, ProductEdit } from '@/product';
import { Color, colors } from '@/colors';

import { convertToBase64 } from '@/app/internal/convertImage';

import { RootState } from '@/app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { getProduct, updateProduct } from '@/app/store/actions/products';
import { addProductPhotos, deleteProductPhoto, setProductPhotos } from '@/app/store/reducers/products';

import '../index.scss';

const LAST_ITEM_PATH_INCREMENT = 1;

const ProductEditPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const product: Product | null = useAppSelector((state: RootState) => state.productsReducer.currentProduct);
    const productPhotos: string[] | [] = useAppSelector((state: RootState) => state.productsReducer.productPhotos);

    const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + LAST_ITEM_PATH_INCREMENT);

    const [files, setFiles] = useState<string[]>();

    const [currentColor, setCurrentColor] = useState<Color>(product.color);
    const [title, setTitle] = useState<string>(product.title);
    const [description, setDescription] = useState<string>(product.description);
    const [price, setPrice] = useState<number>(product.price);
    const [brand, setBrand] = useState<string>(product.brand);

    const getPhotosArray = () => {
        const sliderPhotos: string[] = [];
        console.log(product);

        for (let index = 0; index < product.numOfImages; index++) {
            sliderPhotos.push(`${window.location.origin}/images/products/${product.id}/${index}.png`);
        }

        return sliderPhotos;
    };

    const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const photosData = [];
            const filesData = [];

            const uploadedFiles = Array.from(e.target.files);

            for await (const uploadedFile of uploadedFiles) {
                photosData.push(URL.createObjectURL(uploadedFile));

                const convertedFile: string = await convertToBase64(uploadedFile);
                filesData.push(convertedFile);
            }
            dispatch(addProductPhotos(photosData));

            setFiles(filesData);
        }
    };

    const onChangePrice = (e: any) => {
        if (e.target.value) {
            setPrice(Number(e.target.value));
        }
    };

    const deletePhoto = (index: number) => {
        dispatch(deleteProductPhoto(productPhotos[index]));
    };

    const editProduct = () => {
        dispatch(updateProduct(
            new ProductEdit(
                product.id,
                title,
                description,
                price,
                product.isAvailable,
                currentColor,
                product.IsLiked,
                brand,
                files
            )));

        navigate(`/product/${product.id}`);
    };

    useEffect(() => {
        const productId = getLastItem(window.location.pathname);
        dispatch(getProduct(productId));
    }, []);

    useEffect(() => {
        const slides = getPhotosArray();
        dispatch(setProductPhotos(slides));

        setCurrentColor(product.color);
        setDescription(product.description);
        setTitle(product.title);
        setPrice(product.price);
        setBrand(product.brand);
    }, [product]);

    return (
        <>
            <Link to="/products" >
                <img src={backButtonIcon} alt="back-button" className="product-edit__back-button" />
            </Link>
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
                        defaultValue={price}
                        type="number"
                        onChange={onChangePrice} />
                    <span></span>
                </div>
                <div className="product-edit__input__wrapper" >
                    <label className="product-edit__label">Бренд</label>
                    <input
                        className="product-edit__input"
                        defaultValue={product.brand}
                        onChange={e => setBrand(e.target.value)}
                    />
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
                <div className="product-edit__photos__container">
                    <div className="product-edit__photos">
                        {productPhotos.map((photo, index) =>
                            <div
                                className="product-edit__photos__item"
                                key={`${photo}-${index}`}
                                onClick={() => deletePhoto(index)}
                                style={{ backgroundImage: `url(${photo})` }}
                            >
                                <span className="product-edit__photos__item__close">
                                    <img
                                        src={closeIcon}
                                        alt="close"
                                        className="product-edit__photos__item__close__icon"
                                    />
                                </span>
                            </div>
                        )}
                    </div>
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
        </>
    );
};

export default ProductEditPage;
