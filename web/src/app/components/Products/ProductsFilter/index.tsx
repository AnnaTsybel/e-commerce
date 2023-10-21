import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Color, colors } from '@/colors';
import { filterProducts } from '@/app/store/actions/products';
import { useAppDispatch } from '@/app/hooks/useReduxToolkit';
import { ProductFilter } from '@/product';

import './index.scss';

export const ProductsFilter = () => {
    const [currentColor, setCurrentColor] = useState<Color>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');

    const { id } = useParams();
    const dispatch = useAppDispatch();

    const handleFiltering = () => {
        dispatch(filterProducts(new ProductFilter(id, currentColor, minPrice, maxPrice)));
    };

    return (
        <div className="products-filter">
            <h3 className="products-filter__title">Фільтр</h3>
            <div className="products-filter__content">
                <div className="products-filter__color">
                    <h4 className="products-filter__color__title">Колір</h4>
                    <div className="products-filter__color__content">
                        {colors.map((color) =>
                            <div
                                key={color}
                                className="products-filter__color__item"
                                onClick={() => setCurrentColor(color)}
                            >
                                <div
                                    className={`product__color__icon
                                        product__${color}__icon 
                                        ${currentColor === color && 'product__color__icon__checked'}`}
                                />
                                <p className="products-filter__color__item__text">{color}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="products-filter__price">
                    <h4 className="products-filter__price__title">Ціна</h4>
                    <div className="products-filter__price__content">
                        <div className="products-filter__price__content__amount">
                            <input type="text" className="products-filter__price__input" />
                            -
                            <input type="text" className="products-filter__price__input" />
                        </div>
                    </div>
                </div>
                <button
                    className="products-filter__button"
                    onClick={() => handleFiltering()}
                    type="button"
                >
                    Відфільтрувати
                </button>
            </div>
        </div>
    );
};
