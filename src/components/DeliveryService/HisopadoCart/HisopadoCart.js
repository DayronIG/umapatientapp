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
  const user = useSelector(store => store.user);
  const { params, selectHomeForm, deliveryInfo } = useSelector(store => store.deliveryService);
  const [price, setPrice] = useState(params.price);
  const [data, setData] = useState([]);

  useEffect(() => {
    if(deliveryInfo.length) {
      const allStatus = ['FREE', 'FREE:IN_RANGE', 'FREE:FOR_OTHER', 'FREE:DEPENDANT', "DEPENDANT"];
      const filterData = deliveryInfo.filter(item => allStatus.includes(item.status) || !item.status);

      setData(filterData);
    }
  }, [deliveryInfo])

  useEffect(() => {
    if(user.core_id) {
      db.firestore().collection('events/requests/delivery')
      .where('patient.uid', '==', user.core_id)
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
  }, [user])

  useEffect(() => {
    setPrice(params.price);
  }, [params])

  useEffect(() => {
    if(deliveryInfo.length) {
      setPrice(Number(params.price) * deliveryInfo.filter(el=>el.status).length);
    }
  }, [deliveryInfo, params.price])

  const handlePay = () => {
    /* for(let i = 0; i < data.length; i++) {
      console.log("pagar")

      if(!!!data[i].status) {
        console.log("pagar")

        swal("Un momento", "Es necesario que guarde todos los hisopados antes de continuar", "warning");
        return;
      }
    } */
    history.push(`/hisopado/payment/${user.ws}`)
  }

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
            <FaChevronLeft onClick={() => history.push(`/home/${user.ws}`)} />
          </div>
          <div className="HisopadoCart__header">
            <h1 className="HisopadoCart__title">Tu compra</h1>
            <p className="HisopadoCart__text">Comprando ahora, nuestro personal de salud llegará a tu domicilio en <span>{params?.delay}.</span></p>
            {
              data.length > 0 ? 
              <p className="HisopadoCart__text">Datos del usuario</p> :
              <div className="HisopadosCart__empty">
                <h2>Carrito vacío</h2>
                <p>Comienza a agregar tus hisopados</p>
              </div>
            }
          </div>
          <section className="HisopadoCart__userSection">
            <div className="HisopadoCart__users">
              {data?.map((item, index) => (
                <HisopadoCartItem key={index} patient={item} index={index}/>
              ))}
            </div>

            <div className="HisopadoCart__addContainer">
              <span 
                onClick={handleAddHisopado}
                className="HisopadoCart__btnContainer">
                <button className="HisopadoCart__addBtn">+</button>
                <span className="HisopadoCart__addMsg">Agregar otro hisopado</span>
              </span>
            </div>
          </section>
        </div>

        {
          data.length > 0 &&
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

            <div className="HisopadoCart__payBtn" onClick={handlePay}>
              <i className="fas fa-credit-card"></i> Pagar ${price}
            </div>
          </div>
        }

      </div>
    </>
  )
}

export default HisopadoCart;