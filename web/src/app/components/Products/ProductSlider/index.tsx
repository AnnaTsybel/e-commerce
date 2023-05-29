import { useEffect, useState } from 'react';

import arrow from '@img/Home/Slider/arrow-icon.png';

import './index.scss';
import { Product } from '@/product';
import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { RootState } from '@/app/store';
import { setProductPhotos } from '@/app/store/reducers/products';

const DEFAULT_SLIDE = 0;
const FIRST_SLIDE = 0;
const STEP = 1;
const INDEX_SLIDER_DECREMENTING_LENGTH = 1;

export const ProductSlider = () => {
    const [current, setCurrent] = useState<number>(DEFAULT_SLIDE);
    const product: Product | null = useAppSelector((state: RootState) => state.productsReducer.currentProduct);
    const productPhotos: string[] | null = useAppSelector((state: RootState) => state.productsReducer.productPhotos);

    const dispatch = useAppDispatch();


    const getPhotosArray = () => {
        const sliderPhotos: string[] = [];

        for (let index = 0; index < product.numOfImages; index++) {
            sliderPhotos.push(`${window.location.origin}/images/products/${product.id}/${index}.png`);
        }

        return sliderPhotos;
    };

    const nextSlide = () => {
        setCurrent(current === product.numOfImages - INDEX_SLIDER_DECREMENTING_LENGTH ?
            FIRST_SLIDE
            :
            current + STEP);
    };

    const prevSlide = () => {
        setCurrent(current === FIRST_SLIDE ?
            product.numOfImages - INDEX_SLIDER_DECREMENTING_LENGTH
            :
            current - STEP);
    };

    useEffect(() => {
        const slides = getPhotosArray();

        dispatch(setProductPhotos(slides));
    }, []);

    return (
        <div className="product-slider">

            <div className="product-slider__arrow product-slider__arrow__prev" onClick={() => prevSlide()}>
                <img src={arrow} alt="arrow-left" className="product-slider__arrow__prev__image" />
            </div>

            <div className="product-slider__container">
                {productPhotos && productPhotos.map((sliderImage, index) =>
                    <div key={`product-slider-image--${index}`}
                        className={` product-slider__item ${index === current ? 'active' : ''}`}
                    >
                        {index === current &&
                            <img
                                src={sliderImage}
                                alt="slider item"
                                className="product-slider__item__image"
                            />
                        }
                    </div>
                )}
            </div>
            <div className="product-slider__arrow product-slider__arrow__next" onClick={() => nextSlide()}>
                <img src={arrow} alt="arrow-right" className=" product-slider__arrow__next__image" />
            </div>
        </div>
    );
};
