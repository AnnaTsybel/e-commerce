import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks/useReduxToolkit';
import { setProductPhotos } from '@/app/store/reducers/products';
import { Product } from '@/product';
import { RootState } from '@/app/store';

import arrow from '@img/Home/Slider/arrow-icon.png';

import './index.scss';

const DEFAULT_SLIDE = 0;
const FIRST_SLIDE = 0;
const STEP = 1;
const INDEX_SLIDER_DECREMENTING_LENGTH = 1;

export const ProductSlider = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(DEFAULT_SLIDE);
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
        setCurrentSlide(currentSlide === product.numOfImages - INDEX_SLIDER_DECREMENTING_LENGTH ?
            FIRST_SLIDE
            :
            currentSlide + STEP);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === FIRST_SLIDE ?
            product.numOfImages - INDEX_SLIDER_DECREMENTING_LENGTH
            :
            currentSlide - STEP);
    };

    useEffect(() => {
        const slides = getPhotosArray();

        dispatch(setProductPhotos(slides));
    }, [product]);

    return (
        <div className="product-slider">
            <div className="product-slider__arrow product-slider__arrow__prev" onClick={() => prevSlide()}>
                <img
                    src={arrow}
                    alt="arrow-left"
                    className="product-slider__arrow__prev__image"
                />
            </div>
            <div className="product-slider__container">
                {productPhotos.map((sliderImage, index) =>
                    <div
                        key={sliderImage}
                        className={`product-slider__item ${index === currentSlide ? 'active' : ''}`}
                    >
                        {index === currentSlide &&
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
                <img
                    src={arrow}
                    alt="arrow-right"
                    className=" product-slider__arrow__next__image"
                />
            </div>
        </div>
    );
};
