/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import { payment_url, node_patient } from "../../config/endpoints"
import {CustomUmaLoader} from '../../components/global/Spinner/Loaders';
import moment from "moment";
import swal from '@sweetalert/with-react'
import { FaCreditCard } from 'react-icons/fa';
import './payment.scss';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import Cleave from 'cleave.js/react';
import db from "../../config/DBConnection";

const PaymentCardMP = () => {
    const isLocal = window.location.origin.includes('localhost');
    const dispatch = useDispatch()
    const {params, current, deliveryInfo} = useSelector(state => state.deliveryService)
    const history = useHistory();
    const [loader, setLoader] = useState(false)
    const user = useSelector(state => state.user);
    const hisopadoPrice = parseInt(params?.price);
    const [totalPayment, setTotalPayment] = useState(3499);
    const [paymentDni, setPaymentDni] = useState(user.dni);
    const [submit, setSubmit] = useState(false);
    const [coupon, setCoupon] = useState('')
    const [paymentStatus, setStatus] = useState(false);
    const [statusDetail, setStatusDetail] = useState("");
    const [creditCard, setCreditCard] = useState("");
    const [invalidYear, setInvalidYear] = useState(false);
    const [invalidMonth, setInvalidMonth] = useState(false);
    const [hisopadosToPurchase, setHisopadosToPurchase] = useState([]);
    const [expiry, setExpiry] = useState("12/25")
    const discountParam = useSelector(state => state.deliveryService.params.coupon)
    const MERCADOPAGO_PUBLIC_KEY = isLocal ? 'TEST-f7f404fb-d7d3-4c26-9ed4-bdff901c8231' : "APP_USR-17c898bc-f614-48eb-9cda-0da7d791a0e7"

    useEffect(() => {
      const multiple_clients = JSON.parse(localStorage.getItem("multiple_clients"))
      if(deliveryInfo.length < multiple_clients?.length && Object.keys(multiple_clients?.[0]).length !== 0){
          dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: multiple_clients})
      }
      // console.log(deliveryInfo.filter(el => el.status && !['DONE:RESULT', 'ASSIGN:ARRIVED', 'ASSIGN:DELIVERY'].includes(el.status)));
      setHisopadosToPurchase(deliveryInfo.filter(el => el.status && !['DONE:RESULT', 'ASSIGN:ARRIVED', 'ASSIGN:DELIVERY'].includes(el.status)))
    }, [deliveryInfo])

    const getCurrentService = async () => {
      await db.firestore().collection('events/requests/delivery')
      .where('patient.uid', '==', user.core_id)
      .where('status', 'in', ['FREE', 'FREE:IN_RANGE'])
      .get()
      .then(async res => {
          res.forEach(services => {
              // console.log(services.data());
              let document = {...services.data(), id: services.id}
              // deliveryInfo.push(document)
              dispatch({type: 'SET_DELIVERY_CURRENT', payload: document})
          })
      })
  }
    useEffect(() => {
      if(hisopadosToPurchase && hisopadosToPurchase.length && !isNaN(hisopadoPrice)) {
        setTotalPayment(parseInt(hisopadoPrice) * hisopadosToPurchase.length) 
      }
    }, [hisopadosToPurchase, hisopadoPrice])

    useEffect(() => {
      if(user) {
        getCurrentService();
      }
    }, [user])

    useEffect(() => {
        window.Mercadopago.setPublishableKey(MERCADOPAGO_PUBLIC_KEY);
        window.Mercadopago.getIdentificationTypes();
      }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        setLoader(true)
        const confirm = await swal({
          title: "¿Desea continuar?", 
          text: `Tiempo estimado: ${params.delay}`,
          icon: "info",
          buttons: true,
          dangerMode: false,
        })
        if(confirm) {
          const form = document.getElementsByTagName('form')[0]
          if(!form.elements.email.value){
            swal({
              title: "Debe completar su email", 
              icon: "warning",
              dangerMode: true,
            })
            setLoader(false)
          } else {
            window.Mercadopago.createToken(form, sdkResponseHandler)
          }
        } else {
          setLoader(false)
        }
    }

    function sdkResponseHandler(status, response) {
        console.log(status, response)
        if (status !== 200 && status !== 201 && status !== 202) {
            let error = ""
            response.cause.forEach(el => {
              if(el.description === "invalid parameter cardExpirationMonth") {
                error += "Mes de expiración inválido. "
              } else if (el.description === "invalid parameter cardExpirationYear") {
                error += "Año de expiración inválido. "
              } else if (el.description === "invalid parameter cardNumber") {
                error += "Tarjeta inválida. Verifica el número. "
              }
            })
            swal("Verifique los datos ingresados", `Error: ${error}`, `error`)
            setSubmit(false);
            setLoader(false)
        } else {
            setSubmit(true);
            const form = document.querySelector('#pay')
            const card = document.createElement('input')
            card.setAttribute('name', 'token')
            card.setAttribute('type', 'hidden')
            card.setAttribute('value', response.id)
            card.setAttribute('id', 'token')
            form.appendChild(card)
            postData(form, response.id)
        }
    }

    const postData = useCallback((form, token) => {
      setLoader(true)
      let { paymentMethodId, email } = form.elements
      let cardId = paymentMethodId.value
      if(paymentMethodId.value === "mastercard" || paymentMethodId.value === "unknown") cardId = "master"
      let paymentData = {
          email: email.value || 'info@uma-health.com',
          paymentMethodId: cardId, 
          token: token,
          dni: `${paymentDni}`,
          uid: `${user.core_id}`,
          fullname: `${user.fullname}`,
          amount: parseInt(totalPayment),
          currency: 'ARS',
          id: current.id,
          type: 'delivery',
          coupon,
          clients: hisopadosToPurchase,
          mpaccount: isLocal ? 'sandbox' : 'ihsa'
        }

        let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
        axios.post(payment_url, paymentData, {headers})
            .then(res => {
              setLoader(false)
                if (res.data.body?.status === "approved" || res.data.body?.status === "in_process") {
                  if(!isLocal){
                    window.gtag('event', 'purchase', {
                    'transaction_id': current.id,
                    'affiliation': user?.corporate_norm,
                    'value': parseInt(totalPayment) || parseInt(hisopadoPrice) * hisopadosToPurchase.length,
                    'coupon': '1',
                    'currency': 'ARS',
                    'items': [{
                      "id": 'Hisopado Antígeno',
                      "name": 'Hisopado Antígeno',
                      "price": parseInt(totalPayment) || parseInt(hisopadoPrice) * hisopadosToPurchase.length
                    }],
                    });
                    window.gtag('event', 'conversion', {
                      'send_to': 'AW-672038036/OXYCCNik3-gBEJT5ucAC',
                      'transaction_id': current.id
                    });}
                    setStatus("approved")
                } else if (res.data.body.status === "free") {
                  setStatus("approved")
                } else if (res.data.body.status === "rejected") {
                window.gtag('event', 'payment_failed', {
                  'event_category' : 'warning',
                  'event_label' : 'hisopado_payment'
                });
                setStatusDetail(res.data.body.status_detail)
                setStatus(res.data.body.status)
                    // alert(res.data.body.status)
              }
          })
          .catch(err => {
            setLoader(false)
            console.error('Error tarjeta: ', err)
            window.gtag('event', 'form_payment_failed', {
              'event_category' : 'warning',
              'event_label' : 'hisopado_payment'
            });
            if(paymentMethodId.value === "unknown"){ 
              swal("Verifique el número de tarjeta ingresado", "" ,"warning")
            } else {
              // Si el error persiste comuniquese a info@uma-health.com
              swal("No se ha podido procesar el pago.", "Intente nuevamente. Asegúrese que los datos ingresados correspondan a una TARJETA DE CRÉDITO." ,"error")
            }
            window.Mercadopago.clearSession();
          })
    }, [coupon, deliveryInfo, totalPayment, hisopadosToPurchase])

    const expirationYearCheck = (year) => {
      if(year < moment().format("YY") && year !== ""){
          setInvalidYear(true);
      } else {
          setInvalidYear(false)
      }
    }
    
    const expirationMonthCheck = (month) => {
        if(month.length > 1 && month !== ""){
          setInvalidMonth(false)
        } else {
          setInvalidMonth(true);
        }
    }

    useEffect(() => {
        window.Mercadopago.clearSession();
    }, [])

    useEffect(() => {
        if(paymentStatus === "approved"){
          console.log("Payment success")
          setLoader(false)
          dispatch({type: 'SET_DELIVERY_STEP', payload: "END_ASSIGNATION"})
          localStorage.removeItem("multiple_clients")
          dispatch({ type: 'SET_DELIVERY_CURRENT', payload: {} })
          swal('El pago se ha registrado correctamente', 'Gracias por confiar en ÜMA!', 'success')
            .then(()=> history.push(`/hisopado/listTracker/${user.ws}`))
        } else if(paymentStatus && paymentStatus !== "approved" && paymentStatus !== "") {
            switch(statusDetail){
              case("cc_rejected_insufficient_amount"):
                swal('Fondos insuficientes!', 'Intente nuevamente con otra tarjeta.', 'error')
                break;
              case("cc_rejected_bad_filled_security_code"):
                swal('Código de seguridad inválido!', 'Verifique el código ingresado.', 'error')
                break;
              case("cc_rejected_bad_filled_date"):
                swal('Fecha de expiración inválida!', 'Verifique la fecha ingresado.', 'error')
                break;
              case("cc_rejected_bad_filled_other"):
                swal('Datos inválidos!', 'Verifique los datos ingresados.', 'error')
                break;
              default: 
                swal('No se pudo procesar el pago', 'Intente nuevamente.', 'error')
                break;
            }
            window.Mercadopago.clearSession();
        }
    }, [paymentStatus, history])

    const [cardState, setCardState] = useState({
        number: '',
        name: '',
        cvc: '',
        focus: '',
        month: '01',
        yearh: '25'
      })

    const { number, month, year, name, cvc, focus } = cardState;
    
    const handleFocus = e => {
      setCardState({ ...cardState, focus: e.target.name });
    }

    const validateDiscount = (e) => {
      const inputCode = e.target.value
      setCoupon(inputCode)
      if(discountParam[inputCode]){
        setTotalPayment(totalPayment - totalPayment * (parseInt(discountParam[inputCode].discount) / 100))
      } else {
        setTotalPayment(3499 * hisopadosToPurchase.length)
      }
    }
    
    const handleChange = e => {
      if(e.target){const { name, value } = e.target;
        setCardState({ ...cardState, [name]: value?.trim() });}
      if(name && name === "year" || name === "month") {
        setExpiry(`${month}/${year}`)
      }
    }
  
    const properties = {
      placeholders: { name: 'Tu nombre' },
      locale: { valid: 'válido hasta' }
    }
    
    return (
        <div className="payment-arg">
        {loader && <CustomUmaLoader />}        
        <div className="tarjeta-credito">
          <Cards
            cvc={cvc}
            expiry={expiry}
            focused={focus}
            name={name}
            number={number}
            callback={(a, b) => {
              setCreditCard(a.issuer)
            }}
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
            <Cleave 
              autoComplete="off"
              id="cardNumber" data-checkout="cardNumber"
              name="number"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onChange={(e) => {
                handleChange(e)
              }}
            onFocus={handleFocus}
            options={{creditCard: true}}
            />
          </div>
          <div className="formulario-item">
            <small>Email</small>
            <input
              autoComplete="on"
              type="email"
              name="email"
              placeholder="nombre@email.com"
              id="email"
              data-checkout="email"
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
          <div className="formulario-item">
            <small>Nombre del titular</small>
            <input
              autoComplete="on"
              type="text"
              name="name"
              maxLength="30"
              placeholder="María Hernandez"
              id="cardholderName"
              data-checkout="cardholderName"
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
          <div className="formulario-item">
              <small>Documento del titular</small>
              <div className="document">
              <select id="dni" data-checkout="docType" style={{ display: 'none' }} ></select>
              <input 
              autoComplete="off"
              type="text" id="docNumber" defaultValue={user?.dni?.length <= 8? user.dni: "12345678"}
                  data-checkout="docNumber" 
                  onChange={e => setPaymentDni(e.target.value)}
                  />
              </div>
          </div>
  
          <div className="formulario-vencimiento">
            <div>
              <small>Vencimiento</small>
              <div className="cardExpiration">
              <input 
                autoComplete="off"
                type="text" id="cardExpirationMonth" 
                data-checkout="cardExpirationMonth"
                inputMode="numeric"
                maxLength="2"
                name="month"
                className = {`${!invalidMonth? "": "invalid-input"}`}
                placeholder="Mes"
                onChange={e => {
                  handleChange(e.target.value) 
                  expirationMonthCheck(e.target.value)}}
                onFocus={handleFocus}/>
              <input 
                type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" 
                className = {`${!invalidYear? "": "invalid-input"}`}
                inputMode="numeric"
                placeholder="Año" autoComplete="off"
                maxLength="2"
                name="yearh"
                onChange={e => {
                  handleChange(e.target.value) 
                  expirationYearCheck(e.target.value)}}
                onFocus={handleFocus}/>
              </div>
            </div>
          </div>
            <div className="formulario-item">
              <small>Código de seguridad</small>
              <input
                autoComplete="off"
                id="securityCode" data-checkout="securityCode"
                type="text"
                className=""
                name="cvc"
                maxLength="4"
                placeholder="123"
                onChange={handleChange}
                onFocus={handleFocus}
              />
            </div>
            <div className="formulario-item last__input">
              <small>Código de descuento</small>
              <input
                  autoComplete="off"
                  id="discount" data-checkout="discount"
                  type="text"
                  className=""
                  name="discount"
                  placeholder="CÓDIGO"
                  onChange={
                    (e) => {
                      validateDiscount(e)
                      handleChange(e)
                    }
                  }
                  onFocus={handleFocus}
              />
            </div>
            <input type="hidden" name="paymentMethodId" id="paymentMethodId" defaultValue={creditCard} />
          <button className="payment-button" type="submit" form="pay"><p className="button-text"><FaCreditCard className="icon"/> Pagar ${Math.round(totalPayment)}</p></button>
        </form>
      </div>
    )
  }

  export default PaymentCardMP