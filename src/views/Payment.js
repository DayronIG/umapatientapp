import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import Backbutton from '../components/GeneralComponents/Backbutton';
import PaymentCard from '../components/GeneralComponents/Checkout/PaymentCard';
import SelectService from '../components/GeneralComponents/SelectService/SelectService'
import { GenericHeader } from '../components/GeneralComponents/Headers';
import { MERCADOPAGO_PUBLIC_KEY } from '../config/MercadoPago';

const Payment = (props) => {
  const [servicePrice, setServicePrice] = useState("")
  /**
   * Set credentials and call initial methods
   */
  useEffect(() => {
    window.Mercadopago.setPublishableKey(MERCADOPAGO_PUBLIC_KEY);
    window.Mercadopago.getIdentificationTypes();
    console.log(props)
  }, [])

  useEffect(() => {
    if(props.match.params.service === "cmo") {
      setServicePrice("99")
    } else if (props.match.params.service === "vmd") {
      setServicePrice("399") 
    } else if (props.match.params.service === "amb") {
      setServicePrice("499")
    } else if (props.match.params.service === "office") {
      setServicePrice("400")
    }
    console.log(servicePrice)
  }, [props.match.params.service, servicePrice])


  return (
    <div className="payment-tempbody">
      <GenericHeader>Contratar servicio</GenericHeader>
      <Backbutton />
      <SelectService service={props.match.params.service} price={servicePrice}  />
      <PaymentCard service={props.match.params.service} price={servicePrice} />
    </div>
  )
}

export default withRouter(Payment);