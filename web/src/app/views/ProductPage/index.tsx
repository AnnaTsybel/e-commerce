import productPhoto from '@img/mocked/phone-photo.jpeg';
import { useEffect, useState } from 'react';

import { ProductsClient } from '@/api/products';
import { Product } from '@/product';
import { ProductsService } from '@/product/service';

import './index.scss';

const LAST_ITEM_PATH_INCREMENT = 1;

const ProductPage = () => {
    const [product, setProduct] = useState<Product>();

    const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + LAST_ITEM_PATH_INCREMENT);

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    const setProductData = async() => {
        const currentPath = getLastItem(location.pathname);

        const productData = await productsService.product(currentPath);
        setProduct(productData);
    };

    useEffect(() => {
        setProductData();
    }, []);

    return (
        <div className="product">
            {product &&
                <>
                    <h1 className="product__title">{product.title}</h1>
                    <div className="product__content">
                        <div className="product__photo">
                            <img src={productPhoto} alt={product.title} className="product__photo__image" />
                        </div>
                        <div className="product__info">
                            <div className="product__color">
                                <p className="product__color__text">Колір:</p>
                                <span className={`product__color__icon product__${product.color}__icon`} />
                            </div>

                            <p className="product__price">
                                {product.price} &#8372;
                            </p>

                            {product.isAvailable
                                ? <p className="product__available">Є в нявності</p>
                                : <p className="product__no-available">Нема в наявності</p>
                            }
                            <p className="product__description">
                                {product.description}
                            </p>

                        </div>
                    </div>
                </>
            }
        </div >
    );
};

export default ProductPage;
