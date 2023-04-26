import { Slider } from '@components/Home/Slider';
import { ProductBlock } from '@components/Products/ProductsBlock';
import { Aside } from '@components/Home/Aside';

import { products } from '@/mockedData/product';

import './index.scss';

const Home = () => {
    return (
        <div className="home">
            <Aside />
            <div className="home__content">
                <Slider />
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
            </div>
        </div>
    );
};

export default Home;