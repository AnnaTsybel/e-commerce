import { useState } from 'react';

import sliderPhoto1 from '@img/Home/Slider/sliderPhoto1.jpg';
import sliderPhoto2 from '@img/Home/Slider/sliderPhoto2.jpg';
import sliderPhoto3 from '@img/Home/Slider/sliderPhoto3.jpg';
import arrow from '@img/Home/Slider/arrow-icon.png';

import './index.scss';

const sliderImages = [sliderPhoto1, sliderPhoto2, sliderPhoto3];

const DEFAULT_SLIDE = 0;
const FIRST_SLIDE = 0;
const STEP = 1;
const INDEX_SLIDER_DECREMENTING_LENGTH = 1;

export const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(DEFAULT_SLIDE);
    const sliderImagesLength = sliderImages.length;

    const nextSlide = () => {
        setCurrentSlide(currentSlide === sliderImagesLength - INDEX_SLIDER_DECREMENTING_LENGTH ?
            FIRST_SLIDE
            :
            currentSlide + STEP);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === FIRST_SLIDE ?
            sliderImagesLength - INDEX_SLIDER_DECREMENTING_LENGTH
            :
            currentSlide - STEP);
    };

    return (
        <div className="slider">
            <div className="slider__arrow slider__arrow__prev" onClick={() => prevSlide()}>
                <img
                    src={arrow}
                    alt="arrow-left"
                    className="slider__arrow__prev__image"
                />
            </div>
            <div className="slider__container">
                {sliderImages.map((sliderImage, index) =>
                    <div
                        key={sliderImage}
                        className={` slider__item ${index === currentSlide ? 'active' : ''}`}
                    >
                        {index === currentSlide &&
                            <img
                                src={sliderImage}
                                alt="slider item"
                                className="slider__item__image"
                            />
                        }
                    </div>
                )}
            </div>
            <div className="slider__arrow slider__arrow__next" onClick={() => nextSlide()}>
                <img
                    src={arrow}
                    alt="arrow-right"
                    className=" slider__arrow__next__image"
                />
            </div>
        </div>
    );
};
