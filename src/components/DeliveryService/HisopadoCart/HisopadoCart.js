import React, { useEffect, useRef } from "react";
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
    
    return(
        <>
        <div className="HisopadoCart">
        <BackButton />
        <h1 className="HisopadoCart__title">Tu compra</h1>
        <p>Datos del Usuario</p>
        <section className="HisopadoCart__userSection">
        <div className="HisopadoCart__userContainer">
            {}
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