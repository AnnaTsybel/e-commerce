import { Dispatch, SetStateAction, useState } from 'react';

import { SubCategories } from '@components/Catalog/SubCategories';

import arrowRight from '@img/arrow-right.png';
import { useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { Category, SubCategory } from '@/categories';


import './index.scss';

const INDEX_FIRST_ITEM = 0;

const Catalog: React.FC<{
    setCatalogOpened: Dispatch<SetStateAction<boolean>>;
}>
    = ({ setCatalogOpened }) => {
        const categories: Category[] | null = useAppSelector((state: RootState) => state.categoriesReducer.listCategories);
        const [currentCategory, setCurrentCategory] = useState<Category>(categories[INDEX_FIRST_ITEM]);

        return (
            <div className="catalog" onClick={() => setCatalogOpened(false)}>
                <div className="catalog__content" onClick={e => e.stopPropagation()}>
                    <div className="catalog__main-category">
                        {categories.map((category: Category, index: number) =>
                            <div
                                className={`catalog__main-category__item 
                            ${category.name === currentCategory.name
                                    && 'catalog__main-category__item--active'}`}
                                key={category.id}
                                onMouseEnter={() => setCurrentCategory(category)}
                            >
                                <p className="catalog__main-category__item__text">
                                    {category.name}
                                </p>
                                <span className="catalog__main-category__item__icon">
                                    <img src={arrowRight}
                                        alt="arrow-right"
                                        className="catalog__main-category__item__image" />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="catalog__sub-category">
                        {currentCategory.subcategories.map((subcategory: SubCategory, index: number) =>
                            <SubCategories
                                subcategory={subcategory}
                                key={subcategory.id}
                                setCatalogOpened={setCatalogOpened}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

export default Catalog;
