import React from 'react'
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import './Slider.scss'

const UmaSlider = ({slides = []}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    }

    return (
        <section className="slider">
            <Slider {...settings}>
                {
                    slides.map(slide => (
                        slide
                    ))
                }
            </Slider>
        </section>
    )
}

export default UmaSlider
