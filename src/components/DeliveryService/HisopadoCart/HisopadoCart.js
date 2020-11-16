import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import './../../../styles/deliveryService/HisopadoCart.scss';
import HisopadoCartItem from './HisopadoCartItem';
import db from "../../../config/DBConnection";

const HisopadoCart = (props) => {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const { patient } = useSelector(store => store.queries);
  const { params, selectHomeForm } = useSelector(store => store.deliveryService);

  useEffect(() => {
    if(patient.dni) {
      db.firestore().collection('events/requests/delivery')
      .where('patient.uid', '==', patient.core_id)
      .where('status', 'in', ['FREE', 'FREE:IN_RANGE', 'FREE:FOR_OTHER',  'FREE:DEPENDANT'])
      .get()
      .then(res => {
          res.forEach(services => {
            setFirstPatient(services.data().destination);
          })
      })
    }
  }, [patient])

  const setFirstPatient = (info) => {
    console.log(info);
    setItems([...items, {
      title: patient.fullname,
      fullname: patient.fullname,
      dni: patient.dni,
      ws: patient.ws,
      dob: patient.dob,
      sex: patient.sex,
      address: info.user_address || selectHomeForm.address,
      piso: info.user_floor || selectHomeForm.piso,
      depto: info.user_number || selectHomeForm.depto,
      lat: info.user_lat || selectHomeForm.lat,
      lng: info.user_lon || selectHomeForm.lng,
      isOpen: false
    }])
  }

  const handleAddHisopado = () => {
    setItems([...items, {
      title: 'Completar información',
      fullname: '',
      dni: '',
      ws: '',
      dob: '',
      sex: '',
      address: '',
      piso: '',
      depto: '',
      isOpen: true
    }])
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
            <p className="HisopadoCart__text">Comprando ahora, nuestro personal de salud llegará a tu domicilio en las próximas <span>4 horas.</span></p>
            <p className="HisopadoCart__text">Datos del usuario</p>
          </div>
          
          <section className="HisopadoCart__userSection">
            <div className="HisopadoCart__users">
              {items.map((item, index) => (
                <HisopadoCartItem key={index} patient={item} id={index} />
              ))}
            </div>

            <div className="HisopadoCart__addContainer">
              <span 
                onClick={handleAddHisopado}
                className="HisopadoCart__btnContainer"
              >
              
                <button className="HisopadoCart__addBTn">+</button>
                <span className="HisopadoCart__addMsg">Agregar otro hisopado</span>
              </span>
            </div>
          </section>
        </div>

        <div className="HisopadoCart__payment">
          <div className="HisopadoCart__payDetails">
            <div className="HisopadoCart__payDetail">
              <span>Subtotal</span>
              <span>${params.price}</span>
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
                <strong>${params.price}</strong>
              </span>
            </div>
          </div>

          <div className="HisopadoCart__payBtn">
            <i className="fas fa-credit-card"></i> Pagar ${params.price}
          </div>
        </div>
      </div>
    </>
  )
}

export default HisopadoCart;