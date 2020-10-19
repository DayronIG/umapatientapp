import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import Carousel from 'nuka-carousel';
import { withRouter } from 'react-router-dom';
import SlideItem from './SlideItem';
import '../../../styles/Slider.scss'
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import slides from '../../slider-content';

const Slider = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [componenteJuego, setComponenteJuego] = useState(null);
  const dispatch = useDispatch();

  const properties = {
    autoplay: true,
    autoplayInterval: 3000,
    wrapAround: true,
    cellSpacing: 50,
    renderCenterLeftControls: null,
    renderCenterRightControls: null,
    renderBottomCenterControls: null,
  }

  const cerrarModal = () => {
    setModalOpen(false);
    dispatch({ type: 'TOGGLE_DETAIL' });
  }

  return (
    <>
      {modalOpen ?
        <MobileModal title="Memo Test" callback={cerrarModal}>
          {componenteJuego}
        </MobileModal>
        :
        <div className="carousel-container">
          <h6 className="titulo-recomendacion">Recomendaciones COVID-19</h6>
          <Carousel {...properties}>
            {slides.map((slide, i) => <SlideItem slide={slide} key={i} setModalOpen={setModalOpen} setComponenteJuego={setComponenteJuego} />)}
          </Carousel>
        </div>
      }
    </>

  )
}

export default withRouter(Slider);
