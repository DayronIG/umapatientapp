/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {CustomUmaLoader} from '../../components/global/Spinner/Loaders';
import moment from "moment";
import swal from "sweetalert"
import { FaArrowLeft } from 'react-icons/fa';
import './payment.scss';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'

const PaymentCardMP = (props) => {
    const history = useHistory();
    const [loader, setLoader] = useState(false)
    const user = useSelector(state => state.queries.patient);
    const totalPayment = 200
    const [submit, setSubmit] = useState(false);
    const [paymentStatus, setStatus] = useState(false);
    const [creditCard, setCreditCard] = useState("");
    const [invalidYear, setInvalidYear] = useState(false);
    const payment_url_test = `http://localhost:8080/mercadopago/payment`;
    const MERCADOPAGO_PUBLIC_KEY = 'TEST-f7f404fb-d7d3-4c26-9ed4-bdff901c8231';
    // const MERCADOPAGO_PUBLIC_KEY = "APP_USR-e4b12d23-e4c0-44c8-bf3e-6a93d18a4fc9";

    useEffect(() => {
        window.Mercadopago.setPublishableKey(MERCADOPAGO_PUBLIC_KEY);
        window.Mercadopago.getIdentificationTypes();
      }, [])

    /**
     * This method is executed when credit card input has more than 6 characters
     * Then calls getPaymentMethod function of the MercadoPago SDK
     *
     * @param {Object} event HTML event
     */

    // function guessingPaymentMethod(event) {
    //     const bin = event.currentTarget.value;
    //     console.log(bin, event)
    //     if (bin.length >= 6) {
    //         window.Mercadopago.getPaymentMethod({
    //             "bin": bin.substring(0, 6),
    //         }, setPaymentMethodInfo);
    //     }
    // }

    /**
        * This method is going to be the callback one from getPaymentMethod of the MercadoPago Javascript SDK
        * Is going to be creating a hidden input with the paymentMethodId obtain from the SDK
        *
        * @param {Number} status HTTP status code
        * @param {Object} response API Call response
    */

    // function setPaymentMethodInfo(status, response) {
    //     const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');
    //     setCreditCard(response[0]?.id)
    //     if (status === 200) {
    //         if (paymentMethodElement) {
    //             paymentMethodElement.value = response[0].id;
    //         } else {
    //             const form = document.querySelector('#pay');
    //             const input = document.createElement('input');
    //             input.setattribute('name', 'paymentMethodId');
    //             input.setAttribute('type', 'hidden');
    //             input.setAttribute('value', response[0].id);
    //             form.appendChild(input);
    //         }
    //     } else {
    //         console.log(`Método de pago no encontrado`);
    //     }
    // }

    function handleSubmit(event) {
        event.preventDefault()
        if (!submit) {
            const form = document.getElementsByTagName('form')[0]
            window.Mercadopago.createToken(form, sdkResponseHandler)
        } else {
            alert("Ya realizaste el pago")
        }
    }

    function sdkResponseHandler(status, response) {
        console.log(status, response)
        if (status !== 200 && status !== 201) {
            swal("Verifique los datos ingresados", "" ,"error")
            setSubmit(false);
        } else {
            setSubmit(true);
            const form = document.querySelector('#pay')
            const card = document.createElement('input')
            card.setAttribute('name', 'token')
            card.setAttribute('type', 'hidden')
            card.setAttribute('value', response.id)
            card.setAttribute('id', 'token')
            form.appendChild(card)
            // console.log("Response", response)
            postData(form, response.id)
        }
    }

    function postData(form, token) {
        setLoader(true)
        let { paymentMethodId } = form.elements
        console.log(paymentMethodId, form.elements, token)
        let paymentData = {
            email: `${user.email}`, // hardcoded
            paymentMethodId: paymentMethodId.value, 
            token: token,
            dni: `${user.dni}`,
            fullname: `${user.fullname}`,
            amount: parseInt(totalPayment),
            currency: 'ARS'
         }
        console.log(paymentData) 
         let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
         axios.post(payment_url_test, paymentData, headers)
             .then(res => {
                 setLoader(false)
                 console.log(res.data.body)
                 if (res.data.body.status === "approved") {
                     setStatus("approved")
                 } else if (res.data.body.status === "rejected") {
                     setStatus(res.data.body.status)
                     // alert(res.data.body.status)
                 } else {
                     setStatus(res.data.body.status)
                     swal(res.data.body.status, "", "error")
                 }
             })
             .catch(err => {
                 setLoader(false)
                 console.log(err)
                 setStatus("failed")
             })
    }

    const expirationYearCheck = (year) => {
        if(year < moment().format("YY") && year !== ""){
            setInvalidYear(true);
        } else {
            setInvalidYear(false)
        }
    }

    useEffect(() => {
        window.Mercadopago.clearSession();
    }, [])

    useEffect(() => {
        if(paymentStatus === "approved"){
            swal('El pago se ha registrado correctamente', 'Gracias por confiar en ÜMA!', 'success')
            .then(()=> history.push("/"))
        } else if(paymentStatus && paymentStatus !== "approved" && paymentStatus !== "") {
            swal('Ocurrió un problema al ingresar el pago', 'Porfavor intente mas tarde.', 'error')
            .then(()=> history.push("/"))
        }
    }, [paymentStatus, history])

    const [state, setState] = useState({
        number: '',
        name: '',
        cvc: '',
        expiry: '',
        focus: ''
      })
      const { number, name, cvc, expiry, focus } = state;
    
      const handleFocus = e => {
        setState({ ...state, focus: e.target.name });
      }
    
      const handleChange = e => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
      }
    
      const properties = {
        placeholders: { name: 'Tu nombre aquí' },
        locale: { valid: 'válido hasta' }
      }
    
      return (
          <>
          {loader && <CustomUmaLoader />}        
          {/* <FaArrowLeft className="flecha-pay" /> */}
          <div className="tarjeta-credito">
            {/* <p className="titulo-card">Servicio a Pagar</p> */}
            <Cards
              cvc={cvc}
              expiry={expiry}
              focused={focus}
              name={name}
              number={number}
              callback={(a, b) => {
                setCreditCard(a.issuer)
                console.log(a, b)}}
              {...properties}
            />
          </div>
          <form 
          className="formulario-credito"
          method="post"
          id="pay"
          name="pay"
          onSubmit={(e) => handleSubmit(e)}
          >
            <div className="formulario-item">
              <small>Número de la tarjeta</small>
              <input
                id="cardNumber" data-checkout="cardNumber"
                type="text"
                name="number"
                placeholder="Número de tarjeta"
                onChange={(e) => {
                  handleChange(e)
                }}
                onFocus={handleFocus}
              />
            </div>
            
            <div className="formulario-item">
              <small>Nombre</small>
              <input
                type="text"
                name="name"
                maxLength="30"
                placeholder="Nombre"
                id="cardholderName"
                data-checkout="cardholderName"
                onChange={handleChange}
                onFocus={handleFocus}
              />
            </div>

            <div>
                <div className="document">
                <select id="dni" data-checkout="docType" style={{ display: 'none' }} ></select>
                <input type="text" id="docNumber" defaultValue={user.dni}
                    data-checkout="docNumber" style={{ display: 'none' }}
                    />
                </div>
            </div>
    
            <div className="formulario-vencimiento">
              <div>
                <small>Vencimiento</small>
                <div className="cardExpiration">
                <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth"
                    placeholder="Mes" autoComplete="off" className="mr-3" maxLength="2"
                    onChange={handleChange}
                    onFocus={handleFocus}/>
                <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" className = {`${!invalidYear? "": "invalid-input"}`}
                    placeholder="Año" autoComplete="off" maxLength="2" onChange={e => expirationYearCheck(e.target.value)}
                    onChange={handleChange}
                    onFocus={handleFocus}/>
                </div>
              </div>
            </div>
              <div className="formulario-item">
                <small>CVC</small>
                <input
                  id="securityCode" data-checkout="securityCode"
                  type="text"
                  className=""
                  name="cvc"
                  maxLength="4"
                  placeholder="CVC"
                  onChange={handleChange}
                  onFocus={handleFocus}
                />
              </div>
              <input type="hidden" name="paymentMethodId" id="paymentMethodId" defaultValue={creditCard} />
            <button className="record__trigger--btn styleButton paymentButton" type="submit" form="pay">Pagar ${totalPayment}</button>
          </form>
        </>
      )
    }

    export default PaymentCardMP