/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DBConnection, {firebaseInitializeApp} from '../../config/DBConnection';
import DinamicScreen from '../GeneralComponents/DinamicScreen';
import Carousel from "nuka-carousel";
import slides from '../slider-content';
import SlideItem from './SlideItem';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../GeneralComponents/Modal/MobileModal';
import { CustomUmaLoader } from '../global/Spinner/Loaders';
import NoTracking from './NoTracking';
import SelectedTracking from './SelectedTracking';
import "react-step-progress-bar/styles.css";
import "../../styles/umaCare/umaCare.scss";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TrackingSelector from './TrackingSelector';

const UmaCare = _ => {
  const dispatch = useDispatch();
  let db = DBConnection.firestore(firebaseInitializeApp);
  const { dni, ws } = useSelector(state => state.user);
  const umacare = useSelector(state => state.umacare)
  const {loading, modal} = useSelector(state => state.front)
  const [textDetail, setTextDetail] = useState('');
  const [exists, setExists] = useState(true);

  const carouselProperties = {
    autoplay: true,
    autoplayInterval: 10000,
    wrapAround: true,
    cellSpacing: 10,
    renderCenterLeftControls: null,
    renderCenterRightControls: null,
    speed: 10000
  }


  useEffect(() => {
    if(dni) {
      db.collection('events/labs/umacare').where("patient_ws", "==", ws)
      .onSnapshot(data => {
        setExists(!data.empty);
        let activeTracking = [], inactiveTracking = [], allTrackings = []
        data.forEach((el) => {
          let data = { ...el.data(), id: el.ref.id }
          if(data.active === "ok") {
            activeTracking.push(data)
          } else {
            inactiveTracking.push(data)
          }
        })
        allTrackings = activeTracking.concat(inactiveTracking)
        dispatch({type: 'UMACARE_SET_TRACKINGS', payload: {activeTracking, inactiveTracking, allTrackings}})
      }, (err) => console.error(err))
    }
  }, [dni])


  return (
    <>
      { loading && <CustomUmaLoader  /> }
      {modal && 
            <Modal title="Información" callback={() => {
                dispatch({ type: "CLOSE_MODAL" });
              }}>
              <p className="text-center">{textDetail}</p>
            </Modal>}
      {!exists ? <NoTracking /> 
        :
        <DinamicScreen>
          <TrackingSelector />
          {umacare.allTrackings[umacare.selectedTracking]
              && <SelectedTracking setTextDetail={setTextDetail} />}
          <div className="slider-recomendaciones">
            <h3>Recomendaciones COVID-19</h3>
            <div className="slider">
              <Carousel {...carouselProperties}>
                { slides.map((slide, i) => <SlideItem slide={slide} key={i} />) }
              </Carousel>
            </div>
          </div>
          <Link className="back-home" to="/">Volver al Home</Link>
        </DinamicScreen>
      }
    </>
  )
}

export default withRouter(UmaCare)
