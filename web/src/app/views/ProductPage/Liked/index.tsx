import { useEffect } from 'react';

import { ProductItem } from '@components/Products/ProductItem';

import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { Product } from '@/product';
import { RootState } from '@/app/store';
import { getLikedProducts } from '@/app/store/actions/users';

import './index.scss';

const LikedProducts = () => {
    const dispach = useAppDispatch();

    const likedProducts: Product[] | null = useAppSelector((state: RootState) => state.usersReducer.likedProducts);

    useEffect(() => {
        dispach(getLikedProducts());
    }, []);

    return (
        <div className="liked-products">
            <h2 className="liked-products__title">Liked Products</h2>
            {likedProducts.length ?
                <div className="liked-products__content">
                    {likedProducts.map((product: Product) =>
                        <ProductItem product={product} key={product.title} />
                    )}
                </div>
                :
                <p className="liked-products__no-products"> The is no liked products</p>
            }
        </div>
    );
};

export default LikedProducts;
