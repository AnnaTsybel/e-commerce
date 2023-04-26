import { colors } from '@/colors';

import arrowDownIcon from '@img/arrow-down.png';

import './index.scss';

export const ProductsFilter = () => {
    return (
        <div className="products-filter">
            <h3 className="products-filter__title">Фильтр</h3>
            <div className="products-filter__content">
                <div className="products-filter__brand">
                    <div className="products-filter__top-side">
                        <h4 className="products-filter__brand__title">Бренд</h4>
                        <button className="products-filter__top-side__show-more">
                            <img src={arrowDownIcon}
                                alt="arrow down icon"
                                className="products-filter__top-side__show-more__image" />
                        </button>
                    </div>
                </div>
                <div className="products-filter__color">
                    <h4 className="products-filter__color__title">Колір</h4>
                    <div className="products-filter__color__content">
                        {colors.map((color) =>
                            <div className="products-filter__color__item">
                                <div className={`product__${color}__icon`} />
                                <p className="products-filter__color__item__text">{color}</p>
                            </div>)}
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