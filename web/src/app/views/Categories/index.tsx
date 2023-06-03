
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { catalog } from '../../../mockedData/catalog';

import './index.scss';

const LAST_ITEM_PATH_INCREMENT = 1;

const Categories = () => {
    const dispatch = useDispatch();

    const getLastItem = (thePath: string) => thePath.substring(thePath.lastIndexOf('/') + LAST_ITEM_PATH_INCREMENT);
    useEffect(() => {
        const categoryId = getLastItem(window.location.pathname);
        // dispatch(getProduct(categoryId));
    }, []);

    return (
        <div className="categories">
            {catalog.map(category =>
                <div className="categories__item">

                    <p className="categories__item__title">
                        {category.category}
                    </p>
                    <div className="categories__item__subcategories">
                        {category.subcategories.map((subcategory) =>
                            <Link
                                to={`/category/${category.id}`}
                                className="categories__item__subcategory"
                            >
                                {subcategory.subcategory}
                            </Link>)
                        }
                    </div>
                </div>
            )}
        </div>);
};
export default Categories;
