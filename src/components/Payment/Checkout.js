import React, {useState, useEffect} from 'react';
import MPbutton from './mpButton';
import { mp_payment_url } from "../../config/endpoints";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import Loading from '../GeneralComponents/Loading';
import { BackButton } from '../GeneralComponents/Headers';
import '../../styles/payments/Checkout.scss'

const Checkout = () => {
    const dispatch = useDispatch();
    const [datos, setDatos] = useState('');
    let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
    const { ws } = useSelector(state => state.user);
    const paymentData = useSelector(state => state.payment);
    const  { deliveryInfo }  = useSelector(state => state.deliveryService);
    // const discount = useSelector(state => state.deliveryService.params.discount?.code)

    useEffect(() => {
        if (!paymentData.product) {
            const paymentDataLocal = JSON.parse(localStorage.getItem('paymentData'))
            dispatch({
                type: 'SET_PAYMENT',
                payload: paymentDataLocal
              })
        } 
    },[]);

    useEffect(() => {
        const multiple_clients = JSON.parse(localStorage.getItem("multiple_clients"))
        if(deliveryInfo.length < multiple_clients?.length && Object.keys(multiple_clients?.[0]).length !== 0){
            dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: multiple_clients})
        }
        console.log(deliveryInfo)

      }, [deliveryInfo])

    useEffect(() => {
            const isLocal = window.location.origin.includes('localhost');
            axios.post(mp_payment_url,
                {
                product: paymentData.product, 
                quantity: paymentData.quantity,
                isLocal,
                uid: paymentData.uid,
                id: paymentData.id,
                service: paymentData.service,
                clients: deliveryInfo
                //   discount
                },
                {headers} )
            .then((data)=>{
                setDatos(data.data)
            })
            .catch(err => console.error(err))
    }, [paymentData]);

    return (
        <>
        { datos ? 
            (
                <div className='checkout-background'>
                <BackButton inlineButton={true} customTarget={`/hisopado/carrito/${ws}`}/>
                    <div className='checkout-header'>
                        <h2 className='checkout-header-title'>Checkout</h2>
                        {/* <p className='checkout-header-text'>Resumen de tu compra:</p> */}
                    </div>
                    <div className='checkout-body'>
                            <h3 className='checkout-body-title'>{paymentData.title}</h3>
                            <div className='checkout-body-subtitle'>
                                <h2 className='checkout-body-currency'>AR$ <span className='checkout-body-price'>{datos.price}</span></h2> 
                        </div>
                        <p className='checkout-body-text'>Al clickear el boton de pago seras redirigido a MercadoPago y luego de pagar volveras a la app de UMA.</p>
                        <MPbutton data={datos}/>
                    </div>
                </div>
            ) : 
            <Loading />
        }
        </>
    )
}

export default Checkout;