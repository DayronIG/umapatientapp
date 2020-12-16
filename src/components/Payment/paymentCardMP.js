/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {CustomUmaLoader} from '../../components/global/Spinner/Loaders';
import moment from "moment";
import swal from '@sweetalert/with-react'
import { FaCreditCard } from 'react-icons/fa';
import './payment.scss';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import { payment_url, node_patient } from "../../config/endpoints"
import mpicon from "../../assets/img/delivery/mp.jpg";
import Cleave from 'cleave.js/react';

const PaymentCardMP = () => {
    const dispatch = useDispatch()
    const {params, current, deliveryInfo} = useSelector(state => state.deliveryService)
    const history = useHistory();
    const [loader, setLoader] = useState(false)
    const user = useSelector(state => state.user);
    const hisopadoPrice = parseInt(params?.price);
    const [totalPayment, setTotalPayment] = useState(3499) 
    const [submit, setSubmit] = useState(false);
    const [coupon, setCoupon] = useState('')
    const [paymentStatus, setStatus] = useState(false);
    const [statusDetail, setStatusDetail] = useState("");
    const [creditCard, setCreditCard] = useState("");
    const [invalidYear, setInvalidYear] = useState(false);
    const discountParam = useSelector(state => state.deliveryService.params.discount)
    // const MERCADOPAGO_PUBLIC_KEY = 'TEST-f7f404fb-d7d3-4c26-9ed4-bdff901c8231';
    const MERCADOPAGO_PUBLIC_KEY = "APP_USR-e4b12d23-e4c0-44c8-bf3e-6a93d18a4fc9";

    useEffect(() => {
      const multiple_clients = JSON.parse(localStorage.getItem("multiple_clients"))
      if(deliveryInfo.length < multiple_clients?.length){
          dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: multiple_clients})
      }
    }, [])

    useEffect(() => {
      if(deliveryInfo && deliveryInfo.length && !isNaN(hisopadoPrice)) {
        setTotalPayment(parseInt(hisopadoPrice) * deliveryInfo.filter(el => el.status).length) 
      }
    }, [deliveryInfo, hisopadoPrice])

    useEffect(() => {
        window.Mercadopago.setPublishableKey(MERCADOPAGO_PUBLIC_KEY);
        window.Mercadopago.getIdentificationTypes();
      }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        setLoader(true)
        console.log(moment().format('DD/MM') === "16/12", moment().format('dddd'), moment().format('DD/MM'))
        if(moment().format('dddd') === 'sábado'
          || moment().format('dddd') === 'domingo'
          || (moment().format('dddd') === 'viernes' && moment().format('HH') >= 18)
          || moment().format('DD/MM') === "24/12"
          || moment().format('DD/MM') === "25/12"
          || moment().format('DD/MM') === "31/12"
          || moment().format('DD/MM') === "01/01") {
            const confirm = await await swal({
              title: "¿Desea continuar?", 
              text: "Si abona su compra ahora, nuestro personal de salud acudirá el Lunes",
              icon: "info",
              buttons: true,
              dangerMode: false,
            })
            if(confirm) {
                const form = document.getElementsByTagName('form')[0]
                window.Mercadopago.createToken(form, sdkResponseHandler)
            } else {
              setLoader(false)
            }
        } else {
          const form = document.getElementsByTagName('form')[0]
          await window.Mercadopago.createToken(form, sdkResponseHandler)
        }
    }

    function sdkResponseHandler(status, response) {
        if (status !== 200 && status !== 201 && status !== 202) {
            swal("Verifique los datos ingresados", "Alguno de sus datos personales o de su tarjeta son inválidos" ,"error")
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
          dni: `${user.dni}`,
          uid: `${user.core_id}`,
          fullname: `${user.fullname}`,
          amount: parseInt(totalPayment),
          currency: 'ARS',
          id: current.id,
          type: 'delivery',
          coupon,
          clients: deliveryInfo
//          mpaccount: 'sandbox'
        }
        console.log(paymentData)
        let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
        axios.patch(`${node_patient}/${user.dni}`, {newValues: {mail: email.value}}, {headers})
        .then(res => console.log("Ok"))
        .catch(err => console.log(err))
        axios.post(payment_url, paymentData, {headers})
            .then(res => {
              setLoader(false)
                if (res.data.body?.status === "approved" || res.data.body?.status === "in_process") {
                  window.gtag('event', 'purchase', {
                    'transaction_id': current.id,
                    'affiliation': user?.corporate_norm,
                    'value': parseInt(totalPayment) || 3499,
                    'coupon': '1',
                    'currency': 'ARS',
                    'items': [{
                      "id": 'Hisopado Antígeno',
                      "name": 'Hisopado Antígeno',
                      "price": parseInt(totalPayment) || 3499
                    }],
                    });
                    window.gtag('event', 'conversion', {
                      'send_to': 'AW-672038036/OXYCCNik3-gBEJT5ucAC',
                      'transaction_id': current.id
                    });
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
            console.error(err)
            window.gtag('event', 'payment_failed', {
              'event_category' : 'warning',
              'event_label' : 'hisopado_payment'
            });
            if(paymentMethodId.value === "unknown"){ 
              swal("Verifique el número de tarjeta ingresado", "" ,"warning")
            } else {
              swal("No se ha podido procesar el pago.", "Intente nuevamente. Si el error persiste comuniquese a info@uma-health.com" ,"error")
            }
            window.Mercadopago.clearSession();
          })
  }, [coupon, deliveryInfo])

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
          console.log("Payment success")
          setLoader(false)
          dispatch({type: 'SET_DELIVERY_STEP', payload: "END_ASSIGNATION"})
          localStorage.removeItem("multiple_clients")
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

      const validateDiscount = (e) => {
        setCoupon(e.target.value)
        if(e.target.value === discountParam.code){
          setTotalPayment(totalPayment - totalPayment * (parseInt(discountParam.value) / 100))
        } else {
          setTotalPayment(totalPayment)
        }
      }
    
      const handleChange = e => {
        if(e.target){const { name, value } = e.target;
        setState({ ...state, [name]: value?.trim() });}
      }
    
      const properties = {
        placeholders: { name: 'Tu nombre aquí' },
        locale: { valid: 'válido hasta' }
      }

/*       function mercadoPagoButton() {
        swal({
          buttons: {
            cancel: "Cerrar",
          },
          content: (
          <div>
            <img src={mpicon} alt="mercadopago" style={{width: '100%'}} />
            Si no cuentas con tarjeta de crédito o tu pago es rechazado puedes abonar con MercadoPago.<br />
            Una vez realizado debes informar el pago a info@uma-health.com con el número de operación o comprobante. <br />
            <a href="https://mpago.la/1VhVvc2" 
              className="btn" style={{background: '#02b1ec', color: '#fff'}} 
              target="_blank"
              rel="noopener noreferrer">
                Pagar con MercadoPago
            </a>
          </div>
          )
        })
      } */
    
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
              {/* <input
                autoComplete="off"
                id="cardNumber" data-checkout="cardNumber"
                type="number"
                name="number"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                onChange={(e) => {
                  handleChange(e)
                }}
                onFocus={handleFocus}
              /> */}
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
              <small>Nombre</small>
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

            <div>
                <div className="document">
                <select id="dni" data-checkout="docType" style={{ display: 'none' }} ></select>
                <input 
                autoComplete="off"
                type="text" id="docNumber" defaultValue={user?.dni?.length <= 8? user.dni: "12345678"}
                    data-checkout="docNumber" style={{ display: 'none' }}
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
                placeholder="Mes" className="mr-3"
                onChange={handleChange}
                onFocus={handleFocus}/>
                <input 
                type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" 
                className = {`${!invalidYear? "": "invalid-input"}`}
                inputMode="numeric"
                placeholder="Año" autoComplete="off"
                maxLength="2"
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
            <button className="payment-button" type="submit" form="pay"><p className="button-text"><FaCreditCard className="icon"/> Pagar ${totalPayment}</p></button>
          </form>
        </div>
      )
    }

    export default PaymentCardMP