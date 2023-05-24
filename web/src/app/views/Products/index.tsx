import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ProductsFilter } from '@components/Products/ProductsFilter';
import { ProductItem } from '@components/Products/ProductItem';

import { Product } from '@/product';
import { UsersClient } from '@/api/users';
import { UsersService } from '@/users/service';
import { User } from '@/users';
import { ProductsClient } from '@/api/products';
import { ProductsService } from '@/product/service';

import './index.scss';

const Products = () => {
    const [user, setUser] = useState<User>();
    const [products, setProducts] = useState<Product[]>();

    const usersClient = new UsersClient();
    const usersService = new UsersService(usersClient);

    const productsClient = new ProductsClient();
    const productsService = new ProductsService(productsClient);

    useEffect(() => {
        (async function setData() {
            const userData = await usersService.getUser();
            setUser(userData);

            const productsData = await productsService.list();
            setProducts(productsData);
        }());
    }, []);

    return (
        <div className="products">
            <div className="products__content">
                <ProductsFilter />
                <div className="products__cards">
                    {user && user.status === 'admin'
                        && <Link to="/product/create" className="products__cards__button">
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
