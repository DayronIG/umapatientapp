import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { mp_payment_url_refunds, mp_payment_url_payments } from "../../config/endpoints";
import moment from 'moment-timezone';
import { HistoryHeader } from '../GeneralComponents/Headers';
import '../../styles/history/MyRecords.scss';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';

const PaymentRefund = () => {
    const [payments, setPayments] = useState();
    const [cashback, setCashback] = useState(true);
    const headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
    const { uid } = useParams();

    const getPayments = async () => {
        const response = await axios.get(`${mp_payment_url_payments}/${uid}`, { headers })
        setPayments(response.data)
    }
    const handleClick = async (paymentId, transactionAmount) => {
            const response = await axios.post(mp_payment_url_refunds, {
            cashback,
            uid,
            paymentId,
            transactionAmount 

        }, { headers })
        if (cashback) {
            if (response.status === 200) return swal("Reintegro confirmado", "El monto fue reintegrado a tu cuenta de Mercadopago", "success");
            swal("Lo sentimos", "Ocurrio un problema interno y no se pudo realizar el reintegro", "error");
        } else {
            if (response.status === 200) return swal("Reintegro confirmado", `Te sumamos ${transactionAmount} umaCreditos a tu cuenta`, "success");
            swal("Lo sentimos", "Ocurrio un problema interno y no se pudo realizar el reintegro", "error");
        }
        
    }

    useEffect(() => {
        getPayments();
    },[])

    return (
        <>
            <HistoryHeader> Tus Pagos </HistoryHeader>
            <main className='my-history-container'> 
                <h2>Historial de pagos</h2>
                <ul>
                    { payments && payments.map((el, i) => {
                        return (
                            <React.Fragment key={el.order_id}>
                                <li className='my-history-consultation'>
                                <div className='consult-link'>
                                    <section className='title-date'>
                                        <p className='title-clasif'>{`Servicio: ${el.service}`}</p>
                                        <p className='title-date'>{`Estado del pago: ${el.status}`}</p>
                                        <p className='title-date'>{`Fecha de pago: ${moment(el.dt_payment).format('DD-MM-YYYY')}`}</p>
                                        <p className='title-date'>{`Monto: $${el.amount}`}</p>
                                    </section>
                                    </div>
                                    { el.status === 'approved' ? <button className='btn btn-blue-lg' onClick={()=> handleClick(el.order_id, el.amount) } >Pedir devolucion</button> : null }
                                    
                                </li>
                                <hr/>
                            </React.Fragment> 
                        )
                    })}
                </ul>
            </main>
        </>
    )
}

export default PaymentRefund;