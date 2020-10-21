/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {withRouter, useHistory} from 'react-router-dom';
import axios from 'axios';
import {CustomUmaLoader} from '../global/Spinner/Loaders';
import moment from "moment";
import swal from "sweetalert"
import './payment.scss';

const PaymentCardPP = (props) => {
    const history = useHistory();
    const paypal = useRef();
    const [loader, setLoader] = useState(false)
    const user = useSelector(state => state.queries.patient);
    const totalPayment = 200

    useEffect(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions, err) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: "Pago con PayPal",
                    amount: {
                      currency_code: "USD",
                      value: totalPayment,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
                swal('El pago se ha registrado correctamente', 'Gracias por confiar en Health-U!', 'success')
                .then(()=> history.push("/progress"))
                const order = await actions.order.capture();
                console.log(order);
            },
            onError: (err) => {
                swal('Ocurrió un problema al ingresar el pago', 'Porfavor intente mas tarde.', 'error')
                .then(()=> history.push("/resumePayment"))
                console.log(err);
            },
          })
          .render(paypal.current);
      }, []);

    return (
        <>  
            {loader && <CustomUmaLoader />}
            <div className="formulario-credito paypal--payment">
                <div className="payment-title">
                    <b>Datos de pago</b>
                    <hr/>
                    <div className="international-payment-title"> Total: ${totalPayment}</div>
                </div>
                <div className="payment-input-paypal">
                    <br/>
                    <div ref={paypal}></div>
                </div>
            </div>
        </>
    )
}

export default withRouter(PaymentCardPP)