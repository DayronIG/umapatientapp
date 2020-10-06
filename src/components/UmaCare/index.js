import React, { useState, useEffect } from 'react';
import DBConnection from '../../config/DBConnection';
import DinamicScreen from '../GeneralComponents/DinamicScreen';
import Carousel from "nuka-carousel";
import slides from '../slider-content';
import SlideItem from './SlideItem';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../GeneralComponents/Modal/MobileModal';
import Steper from './Steper';
import { CustomUmaLoader } from '../global/Spinner/Loaders';
import { estadoStep } from './helpers';
import "react-step-progress-bar/styles.css";
import "../../styles/umaCare/umaCare.scss";
import 'bootstrap/dist/js/bootstrap.bundle.min';
/* import { FaUserMd } from 'react-icons/fa';
import { MdExpandLess, MdMenu } from 'react-icons/md'; */
import NoTracking from './NoTracking';

const UmaCare = props => {
  let db = DBConnection.firestore();
  const { dni } = useSelector(state => state.queries.patient);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [textDetail, setTextDetail] = useState('');
  const [porcentaje, setPorcentaje] = useState(0);
  const [color, setColor] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [seguimiento, setSeguimiento] = useState(false);
  const [exists, setExists] = useState(true);
  const [estadoActual, setEstadoActual] = useState({
    hisopado: '',
    resultado: '',
    cuarentena: '',
    active: 'ok'
  });
  const [rutaUmacare, setRutaUmacare] = useState({
    doc_id: '',
    ws: ''
  });
  const { doc_id, ws } = rutaUmacare;
  const properties = {
    autoplay: true,
    autoplayInterval: 3000,
    wrapAround: true,
    cellSpacing: 10,
    renderCenterLeftControls: null,
    renderCenterRightControls: null,
  }
  const iconProperties = {
    onClick: () => setSeguimiento(!seguimiento),
    'size':"1.5rem",
    // 'className':"btn-seguimientos", 
    'data-toggle': "collapse",
    'data-target':"#collapseExample",
    'aria-expanded':"false", 
    'aria-controls':"collapseExample"
  }

  useEffect(() => {
    if(dni) {
      db.collection('events/labs/umacare').orderBy('dt_cierre', 'desc')
      .where("patient_dni", "==", dni)
      .onSnapshot(data => {
        const lastDocument = data.docs[0];
        setExists(!data.empty);
        if(lastDocument) {
          let { status, resp, patient_ws, active } = lastDocument.data();
          let [ hisopado, resultado, cuarentena ] = status.split('///');
          if ( resultado === 'idky') resultado = '';
          setEstadoActual({ 
            hisopado: hisopado || '', 
            resultado: resultado || '', 
            cuarentena: cuarentena || '',
            active
          });
          setRutaUmacare({
            doc_id: lastDocument.id,
            ws: patient_ws
          });

          let keys = Object.keys(resp);
          for (let i = keys.length; i >= 0; i--) {
            if(resp[keys[i]] && resp[keys[i]].faces !== "") {
              let face = resp[keys[i]].faces   
              if (face === "better") {
                setColor('verde')
              } else if (face === "equal") {
                setColor('amarillo')
              } else if (face === "worst") {
                setColor('rojo')
              } 
              break
            } else {
              setColor('gris')
            }
          }
        }
      })
      setLoading(false);
    }
  }, [dni])

  useEffect(() => {
    if(estadoActual.hisopado === 'yes') {
      setPorcentaje(35);
    } 
    if (estadoActual.resultado === 'positive' || estadoActual.resultado === 'negative') {
      setPorcentaje(70) 
    }
    if (estadoActual.cuarentena) {
      setPorcentaje(71) 
    }
    if(estadoActual.active !== 'ok') {
      setPorcentaje(100);
    }
  }, [estadoActual])

  return (
    <>
      { loading && <CustomUmaLoader  /> }
      {
        !exists ? <NoTracking /> 
        :
        <DinamicScreen>
          <>
            <div className="seguimientos-container">
              <h4>Seguimiento COVID-19</h4>
            </div>
              {/* {
                !seguimiento ? 
                <MdMenu {...iconProperties} /> :
                <MdExpandLess {...iconProperties} /> 
              }

            <div className="collapse mt-2" id="collapseExample">
              <div className="lista-seguimientos">
                <div className="event">
                  <div>
                    <FaUserMd size="1.2rem" />
                    <span>Consulta Online</span>
                  </div>
                  <strong>30-06-2020</strong>
                </div>
                <div className="event">
                  <div>
                    <FaUserMd size="1.2rem" />
                    <span>Consulta Online</span>
                  </div>
                  <strong>30-06-2020</strong>
                </div>
                <div className="event">
                  <div>
                    <FaUserMd size="1.2rem" />
                    <span>Consulta Online</span>
                  </div>
                  <strong>30-06-2020</strong>
                </div>
              </div>
            </div> */}
          </>
          <Steper porcentaje={porcentaje} color={color} estadoActual={estadoActual} />
          {
            estadoActual.active === 'ok' &&
            <>
              <div className={`detalle ${color ? color : 'gris'}`}>
                { estadoStep(porcentaje, setModalOpen, setTextDetail, estadoActual) }
              </div>

              <div className="estado-salud">
                <h3>Actualizar mi estado</h3>
                <p>Realiza el test diario para actualizar tu estado de salud</p>
                <button
                  type="button"
                  onClick={() => {
                  props.history.push(`/${ws}/umacare/${moment().format('YYYY-MM-DD')}/${doc_id}`)
                }}
                >Realizar test</button>
              </div>
            </>
          }
          {
            modalOpen && 
            <Modal title="Información" callback={() => {
              setModalOpen(false);
              dispatch({ type: 'TOGGLE_DETAIL' })
            }}>
              <p className="text-center font-weight-bold">{textDetail}</p>
            </Modal>
          }

          <div className="slider-recomendaciones">
            <h3>Recomendaciones COVID-19</h3>
            <div className="slider">
              <Carousel {...properties}>
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
