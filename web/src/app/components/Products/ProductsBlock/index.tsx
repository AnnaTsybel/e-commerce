import { Link } from 'react-router-dom';

import { Product } from '@/product';
import { ProductItem } from '@components/Products/ProductItem';

import showMoreIcon from '@img/show-more-icon.png';

import './index.scss';

export const ProductBlock: React.FC<{ products: Product[], title: string, showMoreLink: string }>
    = ({ products, title, showMoreLink }) => {
        return (
            <div className="products-block">
                <div className="products-block__info">
                    <div className="products-block__info__title">
                        {title}
                    </div>
                    <Link to={showMoreLink} className="products-block__info__show-more">
                        <p>Показати більше</p>
                        <img src={showMoreIcon}
                            alt="show more icon"
                            className=" products-block__info__show-more__image" />
                    </Link>
                </div>
                <div className="products-block__content">
                    {products.map((product: Product, index: number) =>
                        <ProductItem product={product} key={`${product.id}-${index}`} />
                    )}
                </div>
                <span className="products-block__line"></span>
            </div>
        );

    };