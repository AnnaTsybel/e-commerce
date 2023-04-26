import { useState } from 'react';

import sliderPhoto1 from '@img/Home/Slider/sliderPhoto1.jpg';
import sliderPhoto2 from '@img/Home/Slider/sliderPhoto2.jpg';
import sliderPhoto3 from '@img/Home/Slider/sliderPhoto3.jpg';
import arrow from '@img/Home/Slider/arrow-icon.png';

import './index.scss';

const sliderImages = [
    {
        photo: sliderPhoto1
    },
    {
        photo: sliderPhoto2
    },
    {
        photo: sliderPhoto3
    },
];

export const Slider = () => {
    const [current, setCurrent] = useState(0);
    const sliderImagesLength = sliderImages.length;

    const nextSlide = () => {
        setCurrent(current === sliderImagesLength - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? sliderImagesLength - 1 : current - 1);
    };

    return (
        <div className="slider">

            <div className="slider__arrow slider__arrow__prev" onClick={() => prevSlide()}>
                <img src={arrow} alt="arrow-left" className="slider__arrow__prev__image" />

            </div>

            <div className="slider__container">
                {sliderImages.map((sliderImage, index) =>
                    <div key={`slider-image--${index}`}
                        className={` slider__item ${index === current ? 'active' : ''}`}
                    >
                        {index === current && (
                            <img
                                src={sliderImage.photo}
                                alt="slider item"
                                className="slider__item__image"
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="slider__arrow slider__arrow__next" onClick={() => nextSlide()}>
                <img src={arrow} alt="arrow-right" className=" slider__arrow__next__image" />
            </div>
        </div>
    );
};