import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Slider } from '@components/Home/Slider';
import { ProductBlock } from '@components/Products/ProductsBlock';
import { Aside } from '@components/Home/Aside';

import { Product } from '@/product';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { getUser } from '@/app/store/actions/users';
import { productsList } from '@/app/store/actions/products';
import { User } from '@/users';

import './index.scss';

const Home = () => {
    const dispatch = useAppDispatch();

    const products: Product[] | null = useAppSelector((state: RootState) => state.productsReducer.products);
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    useEffect(() => {
        dispatch(getUser());
        dispatch(productsList());
    }, []);

    return (
        <div className="home">
            <Aside />
            <div className="home__content">
                <Slider />
                {!!user.role &&
                    <Link to="/product/create" className="home__add-product">
                        Add Product
                    </Link>
                }
                <ProductBlock
                    products={products}
                    title="Рекомендовані товари" />
            </div>
        </div>
    );
};

export default Home;
