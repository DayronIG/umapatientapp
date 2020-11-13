import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../Loading';
import SuccessPayment from './SuccessPayment';
import FailedPayment from './FailedPayment';
import { payment_url_test } from '../../../config/endpoints';
import { getAuth } from "../../../store/actions/firebaseQueries";
import '../../../styles/Payment.scss';

const PaymentCard = (props) => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.front.loading)
    const patient = useSelector(state => state.queries.patient)
    const [submit, setSubmit] = useState(false)
    const [wizard, setWizard] = useState(1)
    const [paymentStatus, setStatus] = useState(false)

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("userData")).ws) {
          getAuth(props.match.params.ws)
            .then(u => {
              dispatch({ type: "GET_PATIENT", payload: u });
            })
            .catch(e => console.log(e));
        } else {
          dispatch({
            type: "GET_PATIENT",
            payload: JSON.parse(localStorage.getItem("userData"))
          });
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, props.match.params.ws]);

    /**
     * This method is executed when credit card input has more than 6 characters
     * Then calls getPaymentMethod function of the MercadoPago SDK
     *
     * @param {Object} event HTML event
     */

    function guessingPaymentMethod(event) {
        const bin = event.currentTarget.value;
        console.log(bin, event)
        if (bin.length >= 6) {
            window.Mercadopago.getPaymentMethod({
                "bin": bin.substring(0, 6),
            }, setPaymentMethodInfo);
        }
    }

    /**
        * This method is going to be the callback one from getPaymentMethod of the MercadoPago Javascript SDK
        * Is going to be creating a hidden input with the paymentMethodId obtain from the SDK
        *
        * @param {Number} status HTTP status code
        * @param {Object} response API Call response
    */

    function setPaymentMethodInfo(status, response) {
        const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');
        console.log(status, response[0].id)
        if (status === 200) {

            if (paymentMethodElement) {
                paymentMethodElement.value = response[0].id;
            } else {
                const form = document.querySelector('#pay');
                const input = document.createElement('input');
                input.setattribute('name', 'paymentMethodId');
                input.setAttribute('type', 'hidden');
                input.setAttribute('value', response[0].id);
                form.appendChild(input);
            }
        } else {
            console.log(`Método de pago no encontrado`);
        }
    }

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
            alert("Verifique los datos ingresados")
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
            // console.log(card, response.id)
            postData(form, response.id)
        }
    }

    function postData(form, token) {
        dispatch({ type: 'LOADING', payload: true })
        let { paymentMethodId } = form.elements
        console.log(paymentMethodId, form.elements, token)
        let paymentData = {
            email: `${patient.email}`, 
            paymentMethodId: paymentMethodId.value, 
            token: token,
            ws: `${patient.ws}`,
            dni: `${patient.dni}`,
            fullname: `${patient.fullname}`,
            service: props.service, 
            amount: parseInt(props.price),
            currency: 'ARS'
        }
        //console.log(paymentData) 
        let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
        axios.post(payment_url_test, paymentData, headers)
            .then(res => {
                dispatch({ type: 'LOADING', payload: false })
                console.log(res.data.body)
                if (res.data.body.status === "approved") {
                    setStatus("approved")
                } else if (res.data.body.status === "rejected") {
                    setStatus(res.data.body.status)
                    // alert(res.data.body.status)
                } else {
                    setStatus(res.data.body.status)
                    alert(res.data.body.status)
                }
            })
            .catch(err => {
                dispatch({ type: 'LOADING', payload: false })
                console.log(err)
                setStatus("failed")
            })
    }

    function paymentHandler(move) {
        if (move === "next") {
            setWizard(wizard + 1)
        } else if (move === "prev") {
            setWizard(wizard - 1)
        }
        //console.log(wizard)
    }

    return (
        <>  
            {loading && <Loading />}
            {paymentStatus === "approved" && <SuccessPayment service={props.service} />}
            {paymentStatus && paymentStatus !== "approved" && paymentStatus !== "" && <FailedPayment service={props.service} />}
            <div className="payment-card">
                <div className="payment-title">
                    <span>Datos de la tarjeta</span>
                    <div clasName="payment-wizard">
                        <FontAwesomeIcon
                            icon={faCircle}
                            className={classnames('wizard-bullet', { 'wizard-current': wizard === 1 })}
                        />
                        <FontAwesomeIcon
                            icon={faCircle}
                            className={classnames('wizard-bullet', { 'wizard-current': wizard === 2 })}
                        />
                        <FontAwesomeIcon
                            icon={faCircle}
                            className={classnames('wizard-bullet', { 'wizard-current': wizard === 3 })}
                        />
                        <FontAwesomeIcon
                            icon={faCircle}
                            className={classnames('wizard-bullet', { 'wizard-current': wizard === 4 })}
                        />
                        <FontAwesomeIcon
                            icon={faCircle}
                            className={classnames('wizard-bullet', { 'wizard-current': wizard === 5 })}
                        />
                    </div>
                </div>
                <form
                    method="post"
                    id="pay"
                    name="pay"
                    onSubmit={(e) => handleSubmit(e)}
                    className="payment-input"
                >
                    <div className={classnames("cardNumber", { 'd-none': wizard !== 1 })}>
                        <label htmlFor="cardNumber">Número de tarjeta</label>
                        <input type="text" id="cardNumber" data-checkout="cardNumber"
                            placeholder="" autoComplete="off"
                            onChange={(e) => guessingPaymentMethod(e)} maxLength={19} 
                            />
                    </div>
                    <div className={classnames("securityCode", { 'd-none': wizard !== 2 })}>
                        <label htmlFor="securityCode">Código</label>
                        <input type="text" id="securityCode" data-checkout="securityCode"
                            placeholder="" autoComplete="off" />
                    </div>
                    <div className={classnames("expirationDate", { 'd-none': wizard !== 3 })}>
                        <label htmlFor="cardExpirationMonth">Vencimiento</label>
                        <div className="cardExpiration d-flex">
                            <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth"
                                placeholder="Mes" autoComplete="off" className="mr-3" />
                            <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear"
                                placeholder="Año" autoComplete="off" />
                        </div>
                    </div>
                    <div className={classnames("fullName", { 'd-none': wizard !== 4 })}>
                        <label htmlFor="cardholderName">
                            Titular de la tarjeta
                    </label>
                        <input type="text" id="cardholderName"
                            data-checkout="cardholderName" placeholder="Nombre y apellido"
                        />
                    </div>
                    <div className={classnames("document", { 'd-none': wizard !== 5 })}>
                        <label htmlFor="docNumber">
                            Número de DNI
                    </label>
                        <select id="docType" data-checkout="docType" style={{ display: 'none' }}></select>
                        <input type="text" id="docNumber"
                            data-checkout="docNumber" placeholder="" />
                    </div>
                    <input type="hidden" name="paymentMethodId" id="paymentMethodId" />
                </form>
                <div className="payment-navigation">
                    {wizard !== 1 ?
                        <div className="move-action" onClick={() => paymentHandler("prev")}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        : <div></div>}
                    {wizard === 5 ? <div></div>
                        :
                        <div className="move-action" onClick={() => paymentHandler("next")}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>}
                </div>
            </div>
            <div className={classnames('payment-footer', { 'footer-active': wizard === 5 })} >
                {wizard === 5 && <button className="btn payment-button" type="submit" form="pay">Pagar</button>}
            </div>
        </>
    )
}

export default withRouter(PaymentCard)