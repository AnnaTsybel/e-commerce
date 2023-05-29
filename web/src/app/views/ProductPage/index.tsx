import { useEffect, useState } from 'react';
import { ProductSlider } from '@components/Products/ProductSlider';
import notLikedProduct from '@img/Product/not-favorite-icon.png';
import likedProduct from '@img/Product/favorite-icon.png';
import deleteIcon from '@img/Product/delete-icon.png';
import editIcon from '@img/Product/edit-icon.png';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';

import { deleteProductData, getProduct, likeProduct, unlikeProduct } from '@/app/store/actions/products';
import { Product } from '@/product';
import { RootState } from '@/app/store';
import { User } from '@/users';

import './index.scss';

const LAST_ITEM_PATH_INCREMENT = 1;
const ONE_PRODUCT_IMAGE = 1;
const NO_PRODUCT_IMAGE = 0;
const ADMIN_ROLE = 1;

const ProductPage = () => {
    const dispatch = useAppDispatch();
    const product: Product | null = useAppSelector((state: RootState) => state.productsReducer.currentProduct);
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const [isFavorite, setIsFavorite] = useState(product.IsLiked);

    const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + LAST_ITEM_PATH_INCREMENT);

    const handleLikes = () => {
        if (isFavorite) {
            dispatch(unlikeProduct(product.id));
        } else {
            dispatch(likeProduct(product.id));
        }
        setIsFavorite(!isFavorite);
    };

    const deleteProduct = () => {
        dispatch(deleteProductData(product.id));
    };

    const editProduct = (id: string) => {
        window.location.replace(`/product-edit/${id}`);
    };

    useEffect(() => {
        const productId = getLastItem(window.location.pathname);
        dispatch(getProduct(productId));
    }, []);

    return (
        <div className="product">
            <h1 className="product__title">{product.title}</h1>
            <div className="product__content">
                <div className="product__photo">
                    {product.numOfImages > ONE_PRODUCT_IMAGE ?
                        <ProductSlider />
                        :
                        <div style={{ backgroundImage: `url(${window.location.origin}/images/products/${product.id}/0.png)` }}
                            className="product__photo__image" />
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
                                    <button className="product__button"
                                        onClick={() => editProduct(product.id)}>
                                        <img src={editIcon} alt="edit-icon" />
                                    </button>
                                    <button className="product__button" onClick={() => deleteProduct()}>
                                        <img src={deleteIcon} alt="delete-icon" />
                                    </button>
                                </>}
                            <div className="product__like" onClick={() => handleLikes()}>
                                {isFavorite
                                    ? <img src={likedProduct}
                                        alt="like"
                                        className="product__like__image" />
                                    : <img src={notLikedProduct}
                                        alt="like"
                                        className="product__like__image" />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="product__price">
                        <p className="product__subtitle">Ціна:</p>
                        <span className="product__price__value"> {product.price} &#8372;</span>
                    </div>
                    <div className="product__price">
                        <p className="product__subtitle">Бренд:</p>
                        <span className="product__price__value"> {product.brand}</span>
                    </div>

                    {product.isAvailable
                        ? <p className="product__available">Є в нявності</p>
                        : <p className="product__no-available">Нема в наявності</p>
                    }
                    <div className="product__description">
                        <p className="product__subtitle">Опис:</p>
                        <p className="product__description__text">
                            {product.description}
                        </p>

                    </div>

                </div>
            </div>
        </div >
    );
};

export default ProductPage;
