import React from 'react'
import Carousel from 'nuka-carousel';
import { withRouter } from 'react-router-dom';
import SlideItem from './SlideItem';
import '../../../styles/Slider.scss'
import slides from '../../slider-content';

const Slider = () => {
  const properties = {
    autoplay: true,
    autoplayInterval: 6000,
    wrapAround: true,
    cellSpacing: 50,
    renderCenterLeftControls: null,
    renderCenterRightControls: null,
    renderBottomCenterControls: null,
  }


  return (
    <>
      <div className="carousel-container">
        <Carousel {...properties}>
          {slides.map((slide, i) => <SlideItem slide={slide} key={i} />)}
        </Carousel>
      </div>
    </>

  )
}

export default withRouter(Slider);
