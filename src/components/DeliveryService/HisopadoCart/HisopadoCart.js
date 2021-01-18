import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import swal from 'sweetalert'
import './../../../styles/deliveryService/HisopadoCart.scss';
import HisopadoCartItem from './HisopadoCartItem';

const HisopadoCart = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const user = useSelector(store => store.user);
  const { params, deliveryInfo, changeMarker, hisopadoUserAddress } = useSelector(store => store.deliveryService);
  const [price, setPrice] = useState(params.price);
  
  useEffect(() => {
    const multiple_clients = JSON.parse(localStorage.getItem("multiple_clients"))
    if(deliveryInfo.length && deliveryInfo.length < multiple_clients?.length){
      dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: multiple_clients})
    }
  }, [deliveryInfo])

  useEffect(() => {
    setPrice(params.price);
  }, [params])

  useEffect(() => {
    if (deliveryInfo.length) {
      setPrice(Number(params.price) * deliveryInfo.filter(el => el.status === 'FREE' || el.status === 'FREE:IN_RANGE').length);
    }
  }, [deliveryInfo, params.price, changeMarker])

  const handlePay = () => {
    history.push(`/hisopado/payment/${user.ws}`)
  }

  const handleAddHisopado = useCallback(() => {
    dispatch({
      type: 'SET_DELIVERY',
      payload: {
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
          uid: user.core_id
        },
        destination: {
          user_address: deliveryInfo[0]?.destination.user_address || hisopadoUserAddress,
          user_floor: '',
          user_number: '',
          user_lat: deliveryInfo[0]?.destination.user_lat,
          user_lon: deliveryInfo[0]?.destination.user_lon
        },
        isOpen: true
      }
    })
  }, [deliveryInfo])

  return (
    <>
      <div className="HisopadoCart">
        <div className="HisopadoCart__container">
          <div className="HisopadoCart__goBack">
            <FaChevronLeft onClick={() => history.push(`/home/${user.ws}`)} />
          </div>
          <div className="HisopadoCart__header">
            <h1 className="HisopadoCart__title">Tu compra</h1>
            <p className="HisopadoCart__text">Comprando ahora, nuestro personal de salud llegará a tu domicilio <span>{params?.delay}.</span></p>
            {
              deliveryInfo.length > 0 ?
                <p className="HisopadoCart__text">Persona a hisopar</p> :
                <div className="HisopadosCart__empty">
                  <h2>Carrito vacío</h2>
                  <p>Comienza a agregar tus hisopados</p>
                </div>
            }
          </div>
          <section className="HisopadoCart__userSection">
            <div className="HisopadoCart__users">
              {deliveryInfo?.map((item, index) => {
                if (item.status === 'FREE' || item.status === 'FREE:IN_RANGE') {
                  return <HisopadoCartItem key={`${index}${item.patient.user}`} patient={item} index={index} />
                }
              })}
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