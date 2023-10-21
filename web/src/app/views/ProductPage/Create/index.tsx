import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { StyledInput } from '@components/common/StyledInput';

import { ProductCreation } from '@/product';
import { Color, colors } from '@/colors';
import { SubSubCategory } from '@/categories';
import { ToastNotifications } from '@/notifications/service';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { convertToBase64 } from '@/app/internal/convertImage';
import { create } from '@/app/store/actions/products';
import { RootState } from '@/app/store';
import { setSubSubCategory } from '@/app/store/actions/categories';
import { addProductPhotos, deleteProductPhoto, setProductPhotos } from '@/app/store/reducers/products';

import closeIcon from '@img/Product/remove-icon.png';
import photoAddIcon from '@img/Product/photo-add-icon.png';
import backButtonIcon from '@img/back-button.png';

import '../index.scss';

const DEFAULT_COLOR_INDEX = 0;
const DEFAULT_PRICE = 0;
const SECOND_INDEX = 1;
const FIRST_INDEX_SUBSUBCATEGORIES = 0;

const ProductCreate = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [currentColor, setCurrentColor] = useState<Color>(colors[DEFAULT_COLOR_INDEX]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(DEFAULT_PRICE);
    const [brand, setBrand] = useState<string>('');
    const [files, setFiles] = useState<string[]>();
    const [currentSubSubCategorie, setCurrentSubSubCategorie] = useState<string>();

    const productPhotos: string[] | [] = useAppSelector((state: RootState) => state.productsReducer.productPhotos);
    const subsubcategories: SubSubCategory[] | [] = useAppSelector((state: RootState) => state.categoriesReducer.allSubSubcategories);

    const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const photosData = [];
            const filesData = [];

            const uploadedFiles = Array.from(e.target.files);

            for await (const uploadedFile of uploadedFiles) {
                photosData.push(URL.createObjectURL(uploadedFile));

                const convertedFile: string = await convertToBase64(uploadedFile);
                filesData.push(convertedFile.split(',')[SECOND_INDEX]);
            }

            dispatch(addProductPhotos(photosData));
            setFiles(filesData);
        }
    };

    const createProduct = async() => {
        try {
            await dispatch(create(new ProductCreation(
                title,
                description,
                price,
                files,
                currentColor,
                brand,
                currentSubSubCategorie
            )));

            navigate('/');
        } catch {
            ToastNotifications.couldNotAddProduct();
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

    const onChangeSubSubCategorie = (e: any) => {
        if (e.target.value) {
            setCurrentSubSubCategorie(e.target.value);
        }
    };

    useEffect(() => {
        if (subsubcategories.length) {
            setCurrentSubSubCategorie(subsubcategories[FIRST_INDEX_SUBSUBCATEGORIES].name);
        }
    }, [subsubcategories]);


    useEffect(() => {
        dispatch(setProductPhotos([]));
        dispatch(setSubSubCategory());
    }, []);

    return (
        <>
            <Link to="/home">
                <img src={backButtonIcon}
                    alt="back-button"
                    className="product-create__back-button" />
            </Link>
            <form className="product-create">
                <h2 className="product-create__title">Створення продукту</h2>
                <StyledInput
                    title="Назва"
                    onChange={e => setTitle(e.target.value)}
                    required={true}
                    value={title}
                />
                <StyledInput
                    title="Бренд"
                    onChange={e => setBrand(e.target.value)}
                    required={true}
                    value={brand}
                />
                <div className="product-create__input__wrapper" >
                    <label className="product-create__label">Ціна</label>
                    <input
                        className="product-create__input"
                        type="number"
                        onChange={onChangePrice}
                    />
                    <span></span>
                </div>
                <div className="product-create__select">
                    <select
                        onChange={onChangeSubSubCategorie}
                        value={currentSubSubCategorie}
                    >
                        {subsubcategories.length &&
                            subsubcategories.map((subsubcategory: SubSubCategory) =>
                                <option
                                    key={subsubcategory.id}
                                    value={subsubcategory.name}
                                >
                                    {subsubcategory.name}
                                </option>
                            )}
                    </select>
                    <span className="product-create__select__arrow" >
                        &#9660;
                    </span>
                </div>
                <textarea
                    className="product-create__textarea"
                    placeholder="Опис"
                    onChange={e => setDescription(e.target.value)}
                />
                <div className="product-create__color__content">
                    {colors.map((color) =>
                        <div
                            key={color}
                            className="product-create__color__item">
                            <div
                                className={`product__color__icon product__${color}__icon 
                                ${currentColor === color ? 'product-create__color__checked' : ''}`}
                                onClick={() => setCurrentColor(color)} />
                            <p className="product-create__color__item__text">{color}</p>
                        </div>)}
                </div>
                <div className="product-create__photos__container">
                    <div className="product-create__photos">
                        {productPhotos.map((photo, index) =>
                            <div
                                className="product-create__photos__item"
                                key={`${photo}-${index}`}
                                onClick={() => deletePhoto(index)}
                                style={{ backgroundImage: `url(${photo})` }}
                            >
                                <span className="product-create__photos__item__close">
                                    <img
                                        src={closeIcon}
                                        alt="close"
                                        className="product-create__photos__item__close__icon"
                                    />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="product-create__photo" >
                    <p>Оберіть фото продукту</p>
                    <label
                        className="product-create__photo__label"
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
                        multiple
                        hidden
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
