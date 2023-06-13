import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Slider } from '@components/Home/Slider';
import { ProductBlock } from '@components/Products/ProductsBlock';
import { Aside } from '@components/Home/Aside';

import { Product } from '@/product';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { amountOfLikedProducts, getUser } from '@/app/store/actions/users';
import { getRecommendationForHomePage } from '@/app/store/actions/products';
import { User } from '@/users';

import './index.scss';
import { setCategories } from '@/app/store/actions/categories';

const USER_ADMINISTRATOR = 1;

const Home = () => {
    const dispatch = useAppDispatch();

    const productRecommendationForHome: Product[] | null = useAppSelector((state: RootState) => state.productsReducer.productRecommendationForHome);
    const user: User | null = useAppSelector((state: RootState) => state.usersReducer.user);

    useEffect(() => {
        dispatch(getUser());
        dispatch(getRecommendationForHomePage());
        dispatch(setCategories());
    }, []);

    return (
        <div className="home">
            <Aside />
            <div className="home__content">
                <Slider />
                {user.role === USER_ADMINISTRATOR &&
                    <Link to="/product/create" className="home__add-product">
                        Add Product
                    </Link>
                }
                <ProductBlock
                    products={productRecommendationForHome}
                    title="Рекомендовані товари" />
            </div>
        </div>
    );
};

export default Home;
