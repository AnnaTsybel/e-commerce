import { product } from '@/mockedData/product';

import productPhoto from '@img/mocked/phone-photo.jpeg';

import './index.scss';

const Product = () => {
    return (
        <div className="product">
            <h1 className="product__title">{product.title}</h1>
            <div className="product__content">
                <div className="product__photo">
                    <img src={productPhoto} alt={product.title} className="product__photo__image" />
                </div>
                <div className="product__info">
                    <div className="product__color">
                        <p className="product__color__text">Колір:</p>
                        <span className={`product__${product.color}__icon`} />
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
        </div >
    );
};

export default Product;