
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import backButtonIcon from '@img/back-button.png';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { setCurrentCategory } from '@/app/store/actions/categories';
import { SubCategory, SubSubCategory } from '@/categories';

import './index.scss';

const Categories = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<string>();

    const currentCategory: SubCategory[] | null = useAppSelector((state: RootState) => state.categoriesReducer.currentCategory);

    const onLoadPage = () => {
        if (id) {
            dispatch(setCurrentCategory(id));
        }
    };

    useEffect(() => {
        onLoadPage();
    }, []);

    return (
        <div className="categories">
            <Link to="/">
                <img src={backButtonIcon}
                    alt="back-button"
                    className="categories__back-button" />
            </Link>
            <div className="categories__content">


                {currentCategory.map((category: SubCategory) =>
                    <div className="categories__item"
                        key={category.id}
                    >

                        <div
                            className="categories__item__photo"
                            style={{ backgroundImage: `url(${window.location.origin}/images/categories/${category.id}.png` }} />
                        <p className="categories__item__title">
                            {category.name}
                        </p>
                        <div className="categories__item__subcategories">
                            {category.subsubcategories.map((subsubcategory: SubSubCategory) =>
                                <Link
                                    to={`/category/${subsubcategory.id}/products`}
                                    className="categories__item__subcategory"
                                    key={subsubcategory.id}
                                >
                                    {subsubcategory.name}
                                </Link>)
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>);
};
export default Categories;
