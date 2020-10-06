import React from "react";
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../../styles/generalcomponents/SliderHome.scss';
import amb from '../../assets/checkout/amb.png'
import vmd from '../../assets/checkout/vmd.png'
import cmo from '../../assets/checkout/cmo.png'
import Carousel from "nuka-carousel";
// import advertise from '../../assets/advertise-a.png';

const properties = {
  autoplay: true,
  autoplayInterval: 3000,
  wrapAround: true,
  cellSpacing: 10,
  renderCenterLeftControls: null,
  renderCenterRightControls: null,
}

const SliderHome = props => {
  const patient = useSelector(state => state.queries.patient)
  return (
    <>
      <div className="moreContent-container">
        <h5>Descubre más</h5>

        <div className="images-container">
          <Carousel {...properties}>
            <div className="slide-img">
              <img src={cmo} alt="promotion" onClick={() => props.history.push(`${patient.ws}/onlinedoctor/who`)} />
            </div>
            <div className="slide-img">
              <img src={vmd} alt="promotion" onClick={() => props.history.push(`${patient.ws}/vmd`)} />
            </div>
            <div className="slide-img">
              <img src={amb} alt="promotion" onClick={() => props.history.push(`${patient.ws}/ambulance`)} />
            </div>
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default withRouter(SliderHome);
