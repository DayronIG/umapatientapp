/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {withRouter, useHistory} from 'react-router-dom';
import { setLoader } from 'ducks/actions/loader';
import { Divider } from 'antd';
import axios from 'axios';
import Loader from 'features/loader';
import moment from "moment";
import swal from "sweetalert"
import './style.scss';

const PaymentCardIC = (props) => {
    const history = useHistory();
    const paypal = useRef();
    const dispatch = useDispatch();
    const { loader } = useSelector((state) => state.loader);
    const user = useSelector(state => state.userAuthReducer.currentUser);
    const totalPayment = useSelector(state => state.resumePaymentReducer.totalPayment);

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
            {loader && <Loader />}
            <div className="payment-card">
                <div className="payment-title">
                <Divider orientation="left" plain>
                    Datos de pago
                </Divider>
                </div>
                <div className="payment-input-paypal">
                    <div className="international-payment-title"> Total: ${totalPayment}</div>
                    <br/>
                    <div ref={paypal}></div>
                </div>
            </div>
        </>
    )
}

export default withRouter(PaymentCardIC)