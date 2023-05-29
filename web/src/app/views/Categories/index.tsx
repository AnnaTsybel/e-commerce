
import { Link } from 'react-router-dom';
import { catalog } from '../../../mockedData/catalog';

import './index.scss';

const Categories = () => {


    return (
        <div className="categories">
            {catalog.map(category =>
                <div className="categories__item">
                    <Link to={`/categories/${category.id}`} className="categories__item__title">
                        {category.category}
                    </Link>
                    <div className="categories__item__subcategories">
                        {category.subcategories.map((subcategory) =>
                            <Link
                                to={`/categories/${category.id}/subcategory/${subcategory.id}`}
                                className="categories__item__subcategory"
                            >
                                {subcategory.subcategory}
                            </Link>)
                        }
                    </div>
                </div>
            )}
        </div>)
}
export default Categories;
