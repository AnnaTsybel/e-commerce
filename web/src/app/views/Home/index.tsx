import { useEffect, useState } from 'react';

import { Slider } from '@components/Home/Slider';
import { ProductBlock } from '@components/Products/ProductsBlock';
import { Aside } from '@components/Home/Aside';

import { Product } from '@/product';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';

import './index.scss';

const Home = () => {
    const [products, setProducts] = useState<Product[]>();

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    useEffect(() => {
        (async function setData() {
            const productsData = await productsService.list();
            setProducts(productsData);
        }());
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
