import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ProductItem } from '@components/Products/ProductItem';
import { ProductSlider } from '@components/Product/ProductSlider';

import { User } from '@/users';
import { Product } from '@/product';
import { RootState } from '@/app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { amountOfLikedProducts } from '@/app/store/actions/users';
import { deleteProductPhotos } from '@/app/store/reducers/products';
import {
    deleteProductData,
    getProduct,
    likeProduct,
    productRecommendation,
    unlikeProduct,
} from '@/app/store/actions/products';

import notLikedProduct from '@img/Product/not-favorite-icon.png';
import likedProduct from '@img/Product/favorite-icon.png';
import deleteIcon from '@img/Product/delete-icon.png';
import editIcon from '@img/Product/edit-icon.png';
import productNoImage from '@img/Product/no-image.png';

import './index.scss';

const ONE_PRODUCT_IMAGE = 1;
const NO_PRODUCT_IMAGE = 0;
const ADMIN_ROLE = 1;

const ProductPage = () => {
    const dispatch = useAppDispatch();
    const product: Product | null = useAppSelector((state: RootState) => state.productsReducer.currentProduct);
    const productRecommendations: Product[] | null = useAppSelector((state: RootState) => state.productsReducer.productRecomendation);
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const { id } = useParams();

    const [isFavorite, setIsFavorite] = useState(product.IsLiked);

    const handleLikes = async() => {
        if (isFavorite) {
            await dispatch(unlikeProduct(product.id));
        } else {
            await dispatch(likeProduct(product.id));
        }
        await dispatch(amountOfLikedProducts());
        setIsFavorite(!isFavorite);
    };

    const deleteProduct = () => {
        dispatch(deleteProductData(product.id));
    };

    const editProduct = (id: string) => {
        window.location.replace(`/product-edit/${id}`);
    };

    const pageOnLoad = () => {
        dispatch(deleteProductPhotos());

        if (id) {
            dispatch(getProduct(id));
            dispatch(productRecommendation(id));
        }
    };

    useEffect(() => {
        pageOnLoad();
    }, []);

    useEffect(() => {
        setIsFavorite(product.IsLiked);
    }, [product]);

    return (
        <div className="product">
            <h1 className="product__title">{product.title}</h1>
            <div className="product__content">
                <div className="product__photo">
                    {product.numOfImages === NO_PRODUCT_IMAGE ?
                        <div
                            style={{ backgroundImage: `url(${productNoImage})` }}
                            className="product__photo__image"
                        />
                        :
                        product.numOfImages > ONE_PRODUCT_IMAGE ?
                            <ProductSlider />
                            :
                            <div
                                style={{ backgroundImage: `url(${window.location.origin}/images/products/${product.id}/0.png)` }}
                                className="product__photo__image"
                            />
                    }
                </div>
                <div className="product__info">
                    <div className="product__top-side">
                        <div className="product__color">
                            <p className="product__subtitle">Колір:</p>
                            <span className={`product__color__icon product__${product.color}__icon`} />
                        </div>
                        <div className="product__actions">
                            {user.role === ADMIN_ROLE &&
                                <>
                                    <button
                                        className="product__button"
                                        onClick={() => editProduct(product.id)}
                                    >
                                        <img src={editIcon} alt="edit-icon" />
                                    </button>
                                    <button
                                        className="product__button"
                                        onClick={() => deleteProduct()}
                                    >
                                        <img src={deleteIcon} alt="delete-icon" />
                                    </button>
                                </>}
                            <div className="product__like" onClick={() => handleLikes()}>
                                {isFavorite
                                    ? <img
                                        src={likedProduct}
                                        alt="like"
                                        className="product__like__image"
                                    />
                                    : <img
                                        src={notLikedProduct}
                                        alt="like"
                                        className="product__like__image"
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="product__price">
                        <p className="product__subtitle">Ціна:</p>
                        <span className="product__price__value">
                            {product.price} &#8372;
                        </span>
                    </div>
                    <div className="product__price">
                        <p className="product__subtitle">Бренд:</p>
                        <span className="product__price__value"> {product.brand}</span>
                    </div>
                    {product.isAvailable ?
                        <p className="product__available">Є в нявності</p>
                        :
                        <p className="product__no-available">Нема в наявності</p>
                    }
                    <div className="product__description">
                        <p className="product__subtitle">Опис:</p>
                        <p className="product__description__text">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="product__recommendations">
                {productRecommendations.map((product: Product) =>
                    <ProductItem key={product.title} product={product} />
                )}
            </div>
        </div>
    );
};

export default ProductPage;
