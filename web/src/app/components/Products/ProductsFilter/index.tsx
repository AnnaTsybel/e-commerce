import { useState } from 'react';
import { Color, colors } from '@/colors';


import './index.scss';

export const ProductsFilter = () => {
    const [currentColor, setCurrentColor] = useState<Color>();

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
                                    ${currentColor === color && 'product__color__icon__checked'}
                                    `}
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
                            <button className="products-filter__price__button">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
