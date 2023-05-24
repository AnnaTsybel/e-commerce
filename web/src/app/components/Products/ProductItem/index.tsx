import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


import productPhoto from '@img/mocked/phone-photo.jpeg';
import notLikedProduct from '@img/Product/not-favorite-icon.png';
import likedProduct from '@img/Product/favorite-icon.png';
import deleteIcon from '@img/Product/delete-icon.png';
import editIcon from '@img/Product/edit-icon.png';
import { Product } from '../../../../product';

import './index.scss';
import { UsersClient } from '@/api/users';
import { User } from '@/users';
import { UsersService } from '@/users/service';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';

export const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(product.IsLiked);
    const [user, setUser] = useState<User>();

    const usersClient = new UsersClient();
    const usersService = new UsersService(usersClient);

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    const deleteProduct = async() => {
        await productsService.delete(product.id);
    };

    const editProduct = (id: string) => {
        window.location.replace(`/product-edit/${id}`);
    };

    useEffect(() => {
        (async function setClub() {
            const userData = await usersService.getUser();
            setUser(userData);
        }());
    }, []);

    const handleLikes = async() => {
        if (isFavorite && user) {
            await productsService.unlikeProduct(product.id);
        } else if (user) {
            await productsService.likeProduct(product.id);
        }
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="product-item">
            {user &&
                <div className={`products-item 
            ${user.status === 'admin' ? ' products-item__admin' : ''}`}>
                    {user.status === 'admin'
                        && <div className="products-item__buttons">
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
                        <div style={{ backgroundImage: `url(${productPhoto})` }}
                            className="products-item__image" />
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
            }
        </div>
    );
};
