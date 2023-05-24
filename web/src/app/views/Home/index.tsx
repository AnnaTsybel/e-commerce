import { useEffect } from 'react';

import { Slider } from '@components/Home/Slider';
import { ProductBlock } from '@components/Products/ProductsBlock';
import { Aside } from '@components/Home/Aside';

import { Product } from '@/product';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { getUser } from '@/app/store/actions/users';
import { productsList } from '@/app/store/actions/products';

import './index.scss';

const Home = () => {
     const dispatch = useAppDispatch();

    const products: Product[] | null = useAppSelector((state: RootState) => state.productsReducer.products);

    useEffect(() => {
        dispatch(getUser())
        dispatch(productsList())
    }, []);

    return (
        <div className="home">
            <Aside />
            <div className="home__content">
                <Slider />
                {products &&
                    <>
                        <ProductBlock
                            products={products}
                            title="Ви нещодавно дивилися"
                            showMoreLink="/products/seen" />
                        <ProductBlock
                            products={products}
                            title="Рекомендовані товари"
                            showMoreLink="/products/recomendations" />
                        <ProductBlock
                            products={products}
                            title="Популярні товари"
                            showMoreLink="/products/popular" />
                    </>
                }
            </div>
        </div>
    )
}

export default Home;
