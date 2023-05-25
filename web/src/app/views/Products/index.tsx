import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import { ProductsFilter } from '@components/Products/ProductsFilter';
import { ProductItem } from '@components/Products/ProductItem';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { getUser } from '@/app/store/actions/users';
import { productsList } from '@/app/store/actions/products';

import { Product } from '@/product';
import { User } from '@/users';

import './index.scss';

const Products = () => {
    const dispatch = useAppDispatch();

    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);
    const products: Product[] | null = useAppSelector((state: RootState) => state.productsReducer.products);

    useEffect(() => {
        dispatch(getUser());
        dispatch(productsList());
    }, []);

    return (
        <div className="products">
            <div className="products__content">
                <ProductsFilter />
                <div className="products__cards">
                    {user.role &&
                        <Link to="/product/create" className="products__cards__button">
                            Add Product
                        </Link>
                    }
                    {products?.length ?
                        <div className="products__cards__content">
                            {products?.map((product: Product, index: number) =>
                                <ProductItem product={product} key={`${product.id}-${index}`} />
                            )}
                        </div>
                        :
                        <h2 className="products__no-items">No products yet</h2>
                    }
                </div>
            </div>
        </div>
    );
};

export default Products;
