import { ProductItem } from '@components/Products/ProductItem';
import { Product } from '@/product';

import './index.scss';

export const ProductBlock: React.FC<{ products: Product[]; title: string }>
    = ({ products, title }) =>
        <div className="products-block">
            <div className="products-block__info">
                <div className="products-block__info__title">
                    {title}
                </div>
            </div>
            <div className="products-block__content">
                {products.map((product: Product, index: number) =>
                    <ProductItem product={product} key={`${product.id}-${index}`} />
                )}
            </div>
            <span className="products-block__line"></span>
        </div>;

