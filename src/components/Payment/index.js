/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from "react-redux";
import { GenericHeader } from '../GeneralComponents/Headers';
import PaymentCardMP from './paymentCardMP';
import PaymentCardPP from './paymentCardPP';


export default function Payment() {
    // const country = useSelector(state => state.userAuthReducer.location)
    return (
        <div>
          <GenericHeader children="Contratar Servicio" />
            {/* {country === "AR"? <PaymentCardMP />: <PaymentCardIC />} */}
            <PaymentCardPP />
        </div>
    )
}
