import { Link } from 'react-router-dom';

import { ProductsFilter } from '@components/Products/ProductsFilter';
import { ProductItem } from '@components/Products/ProductItem';

import { Product } from '@/product';

import { user } from '@/mockedData/user';
import { products } from '@/mockedData/product';

import './index.scss';

const Products = () => {

    return (
        <div className="products">
            <div className="products__content">
                <ProductsFilter />
                <div className="products__cards">
                    {user.status === 'admin'
                        && <Link to="/product/create" className="products__cards__button">
                            Add Product
                        </Link>}
                    <div className="products__cards__content">
                        {products.map((product: Product, index: number) =>
                            <ProductItem product={product} key={`${product.id}-${index}`} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;