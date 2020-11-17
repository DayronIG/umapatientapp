import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import './../../../styles/deliveryService/HisopadoCart.scss';
import HisopadoCartItem from './HisopadoCartItem';
import db from "../../../config/DBConnection";

const HisopadoCart = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [items, setItems] = useState([]);
  const { patient } = useSelector(store => store.queries);
  const { params, selectHomeForm, deliveryInfo } = useSelector(store => store.deliveryService);
  const [price, setPrice] = useState(params.price);

  useEffect(() => {
    if(patient.core_id) {
      db.firestore().collection('events/requests/delivery')
      .where('patient.uid', '==', patient.core_id)
      .where('status', 'in', ['FREE', 'FREE:IN_RANGE', 'FREE:FOR_OTHER',  'PREASSIGN', 'ASSIGN:DELIVERY', 'ASSIGN:ARRIVED', 'DONE:RESULT', 'FREE:DEPENDANT', "DEPENDANT"])
      .get()
      .then(res => {
         let all_services = []
          res.forEach(services => {
            // setFirstPatient(services.data().destination);
            let document = {...services.data(), id: services.id}
            all_services.push(document)
          })
          dispatch({type: 'SET_DELIVERY_ALL', payload: all_services})
      })
    }
  }, [patient])

  useEffect(() => {
    setPrice(params.price);
  }, [params])

  useEffect(() => {
    if(deliveryInfo.length) {
      setPrice(Number(params.price) * deliveryInfo.length);
    }
  }, [deliveryInfo, params.price])

  // const setFirstPatient = (info) => {
  //   setItems([...items, {
  //     title: patient.fullname,
  //     fullname: patient.fullname,
  //     dni: patient.dni,
  //     ws: patient.ws,
  //     dob: patient.dob,
  //     sex: patient.sex,
  //     address: info.user_address || selectHomeForm.address,
  //     piso: info.user_floor || selectHomeForm.piso,
  //     depto: info.user_number || selectHomeForm.depto,
  //     lat: info.user_lat || selectHomeForm.lat,
  //     lng: info.user_lon || selectHomeForm.lng,
  //     isOpen: false
  //   }])
  // }

  const handleAddHisopado = () => {
    dispatch({type: 'SET_DELIVERY', payload: {
      patient: {
        title: 'Completar información',
        user: '',
        dni: '',
        ws: '',
        dob: '',
        sex: '',
        address: '',
        piso: '',
        depto: '',
      },
      destination: {
        user_address: '',
        user_floor: '',
        user_number: '',
        user_lat: '',
        user_lon: ''
      },
      isOpen: true
      }
    })
  }

  return(
    <>
      <div className="HisopadoCart">
        <div className="HisopadoCart__container">
          <div className="HisopadoCart__goBack">
            <FaChevronLeft onClick={() => history.push(`/home/${patient.ws}`)} />
          </div>
          <div className="HisopadoCart__header">
            <h1 className="HisopadoCart__title">Tu compra</h1>
            <p className="HisopadoCart__text">Comprando ahora, nuestro personal de salud llegará a tu domicilio en <span>{params?.delay}.</span></p>
            {
              deliveryInfo.length > 0 ? 
              <p className="HisopadoCart__text">Datos del usuario</p> :
              <div className="HisopadosCart__empty">
                <h2>Carrito vacío</h2>
                <p>Comienza a agregar tus hisopados</p>
              </div>
            }
          </div>
          <section className="HisopadoCart__userSection">
            <div className="HisopadoCart__users">
              {deliveryInfo?.map((item, index) => (
                <HisopadoCartItem key={index} patient={item} index={index}/>
              ))}
            </div>

            <div className="HisopadoCart__addContainer">
              <span 
                onClick={handleAddHisopado}
                className="HisopadoCart__btnContainer">
                <button className="HisopadoCart__addBTn">+</button>
                <span className="HisopadoCart__addMsg">Agregar otro hisopado</span>
              </span>
            </div>
          </section>
        </div>

        {
          deliveryInfo.length > 0 &&
          <div className="HisopadoCart__payment">
            <div className="HisopadoCart__payDetails">
              <div className="HisopadoCart__payDetail">
                <span>Subtotal</span>
                <span>${price}</span>
              </div>
              {/* <div className="HisopadoCart__payDetail">
                <span>Descuento</span>
                <span>$0</span>
              </div> */}
              <div className="HisopadoCart__payDetail">
                <span>
                  <strong>Total</strong>
                </span>
                <span>
                  <strong>${price}</strong>
                </span>
              </div>
            </div>

            <div className="HisopadoCart__payBtn" onClick={()=>history.push(`/hisopado/payment/${patient.ws}`)}>
              <i className="fas fa-credit-card"></i> Pagar ${price}
            </div>
          </div>
        }

      </div>
    </>
  )
}

export default HisopadoCart;