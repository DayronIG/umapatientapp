import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { node_patient } from "../../../config/endpoints";
import Alert from "../../GeneralComponents/Alert/Alerts";
import Loading from "../../GeneralComponents/Loading";
import BackButton from './../../GeneralComponents/Backbutton';
import './../../../styles/deliveryService/HisopadoCart.scss';

const HisopadoCart = (props) => {
    const dispatch = useDispatch();
    const [dependants, setDependants] = useState(null);
    useEffect(() => {
        localStorage.setItem("userRegistered", props.match.params.ws);
        let ws = localStorage.getItem("userRegistered");
        let dni = localStorage.getItem("userId");
        dispatch({ type: "REGISTER_FIRST_DNI", payload: dni });
        dispatch({ type: "REGISTER_FIRST_WS", payload: ws });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
        axios
          .get(`${node_patient}/dependant`)
          .then(res => {
            const dep=res.data;
            setDependants(dep)
            dispatch({ type: "LOADING", payload: false })
          })
          .catch(function (error) {
            dispatch({
              type: "ALERT",
              payload: {
                type: "warning",
                title: "No se pudo incluir a su dependiente",
                msg:
                  `No se pudo incluir a su dependiente. ${error?.response?.data?.message}`
              }
            })
            dispatch({ type: "LOADING", payload: false })
          })
      
    console.log(dependants);
    return(
        <>
        <div className="HisopadoCart">
        <BackButton />
        <h1 className="HisopadoCart__title">Tu compra</h1>
        <p>Datos del Usuario</p>
        <section className="HisopadoCart__userSection">
        <div className="HisopadoCart__userContainer">
            {dependants > 0 ? dependants.map( dep =>{
                return <div className="HisopadoCart__user">{dep}</div>
            }) : null}
        </div>
        <div className="HisopadoCart__addContainer">
            <span 
            onClick={()=> props.history.push('/hisopado/destinatario/:ws?')}
            className="HisopadoCart__btnContainer">
            <button className="HisopadoCart__addBTn">
                +
            </button>
            <span className="HisopadoCart__addMsg">Agregar otro hisopado</span>
            </span>
        </div>
        </section >
        <div className="HisopadoCart__payment">
            <div className="HisopadoCart__payDetails">
                <div className="HisopadoCart__payDetail"><span>Subtotal</span><span>$3499</span></div>
                <div className="HisopadoCart__payDetail"><span>Descuento</span><span>$0</span></div>
                <div className="HisopadoCart__payDetail"><span><strong>Total</strong></span><span><strong>$3499</strong></span></div>
            </div>
            <div className="HisopadoCart__payBtn">
            <i className="fas fa-credit-card"></i> Pagar $3499
            </div>
        </div>
        </div>
        </>
    )
}

export default withRouter(HisopadoCart);