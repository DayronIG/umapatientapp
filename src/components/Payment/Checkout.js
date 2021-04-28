import React, {useState, useEffect} from 'react';
import MPbutton from './mpButton';
import { mp_payment_url } from "../../config/endpoints";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import Loading from '../GeneralComponents/Loading';
import { BackButton } from '../GeneralComponents/Headers';
import '../../styles/payments/Checkout.scss';
import crossIcon from '../../../src/assets/img/hisopados_cross.svg';

const Checkout = () => {
    const dispatch = useDispatch();
    const [datos, setDatos] = useState('');
    const [loading, setLoading] = useState(false)
    let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
    const paymentData = useSelector(state => state.payments);
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
      }, [deliveryInfo])

    useEffect(() => {
        if(paymentData.uid) {
            setLoading(true)
            const isLocal = window.location.origin.includes('localhost');
            axios.post(mp_payment_url,
                {
                product: paymentData.product, 
                quantity: paymentData.quantity,
                isLocal,
                uid: paymentData.uid,
                id: paymentData.id,
                service: paymentData.service,
                clients: paymentData.service === 'HISOPADO' ? deliveryInfo : '',
                dependant: paymentData.dependant,
                corporate: paymentData.corporate,
                //   discount
                },
                {headers} )
            .then((data)=>{
                setDatos(data.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
        }
    }, [paymentData]);

    return (
        <>
        { loading ? 
            <Loading /> :
            (
               datos ?
               <div className='checkout-background'>
                <BackButton inlineButton={true} customTarget={`/`}/>
                    <div className='checkout-header'>
                        <h2 className='checkout-header-title'>{paymentData.title}</h2>
                        {/* <p className='checkout-header-text'>Resumen de tu compra:</p> */}
                    </div>
                    <div className='checkout-body'>
                            <h3 className='checkout-body-title'>{paymentData.description}</h3>
                            <div className='checkout-body-subtitle'>
                                <h2 className='checkout-body-currency'>AR$ <span className='checkout-body-price'>{datos.price}</span></h2> 
                        </div>
                        <p className='checkout-body-text'>Al clickear el boton de "Pagar" seras redirigido a MercadoPago y luego de pagar volveras a la app de UMA.</p>
                        <MPbutton data={datos}/>
                    </div>
                </div>
                : 
                <div className='checkout-background'>
                    <BackButton inlineButton={true} customTarget={`/`}/>
                    <div className='checkout-header'>
                        <h2 className='checkout-header-title'>Checkout</h2>
                    </div>
                    <div className='checkout-body'>
                        <div className='rejected-icon'>
                            <img src={crossIcon} alt='crossIcon'/>
                        </div>
                        <h3 className='checkout-body-title'>Lo sentimos, ocurrio un problema interno.</h3>
                        <p className='checkout-body-text'>Puedes volver a intentarlo tocando el boton de abajo.</p>
                        <button className='btn btn-blue-lg mb-5' onClick={() => window.location.reload()}>Volver a intentar</button>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default Checkout;