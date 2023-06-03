import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import notLikedProduct from '@img/Product/not-favorite-icon.png';
import likedProduct from '@img/Product/favorite-icon.png';
import deleteIcon from '@img/Product/delete-icon.png';
import editIcon from '@img/Product/edit-icon.png';
import noImage from '@img/Product/no-image.png';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';

import { User } from '@/users';
import { RootState } from '@/app/store';
import { Product } from '@/product';
import { deleteProductData, likeProduct, unlikeProduct } from '@/app/store/actions/products';

import './index.scss';

const NO_PRODUCT_IMAGES = 0;
const USER_ADMINISTRATOR = 0;

export const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
    const dispatch = useAppDispatch();

    const [isFavorite, setIsFavorite] = useState(product.IsLiked);

    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    const deleteProduct = () => {
        dispatch(deleteProductData(product.id));
    };

    const editProduct = (id: string) => {
        window.location.replace(`/product-edit/${id}`);
    };

    const handleLikes = () => {
        if (isFavorite) {
            dispatch(unlikeProduct(product.id));
        } else {
            dispatch(likeProduct(product.id));
        }
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="product-item">
            <div className={`products-item 
            ${user.role === USER_ADMINISTRATOR && ' products-item__admin'}`}>
                {user.role === USER_ADMINISTRATOR &&
                    <div className="products-item__buttons">
                        <button className="products-item__button"
                            onClick={() => editProduct(product.id)}>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                        <button className="products-item__button" onClick={() => deleteProduct()}>
                            <img src={deleteIcon} alt="delete-icon" />
                        </button>
                    </div>
                }
                <Link to={`/product/${product.id}`} >
                    {product.numOfImages === NO_PRODUCT_IMAGES ?
                        <div style={{ backgroundImage: `url(${noImage})` }}
                            className="products-item__image" />
                        :
                        <div style={{ backgroundImage: `url(${window.location.origin}/images/products/${product.id}/0.png)` }}
                            className="products-item__image" />
                    }
                </Link>
                <Link className="products-item__title" to={`/product/${product.id}`}>
                    {product.title}
                </Link>
                <div className="products-item__info">
                    <p className="products-item__price">{product.price} &#8372;</p>
                    <div className="products-item__like" onClick={() => handleLikes()}>
                        {isFavorite
                            ? <img src={likedProduct}
                                alt="like"
                                className="products-item__like__image" />
                            : <img src={notLikedProduct}
                                alt="like"
                                className="products-item__like__image" />
                        }
                    </div>
                </div>
            </div >

        </div>
    );
};
