import { Dispatch, SetStateAction, useState } from 'react';

import { SubCategories } from '@components/Catalog/SubCategories';

import arrowRight from '@img/arrow-right.png';

import './index.scss';

const INDEX_FIRST_ITEM = 0;

const Catalog: React.FC<{
    catalog: any,
    setCatalogOpened: Dispatch<SetStateAction<boolean>>
}>
    = ({ catalog, setCatalogOpened }) => {
        const [currentCategory, setCurrentCategory] = useState(catalog[INDEX_FIRST_ITEM]);

        return (
            <div className="catalog" onClick={() => setCatalogOpened(false)}>
                <div className="catalog__content" onClick={e => e.stopPropagation()}>
                    <div className="catalog__main-category">
                        {catalog.map((catalogItem: any, index: number) =>
                            <div
                                className={`catalog__main-category__item 
                            ${catalogItem.category === currentCategory.category
                                    && 'catalog__main-category__item--active'}`}
                                key={`${catalogItem.category}-${index}`}
                                onMouseEnter={() => setCurrentCategory(catalogItem)}
                            >
                                <p className="catalog__main-category__item__text">
                                    {catalogItem.category}
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
                        {currentCategory.subcategories.map((catalogItem: any, index: number) =>
                            <SubCategories
                                subcategory={catalogItem}
                                key={`${catalogItem.subcategory}-${index}`} />
                        )}
                    </div>
                </div>
            </div>
        );

    };

export default Catalog;