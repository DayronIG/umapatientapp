/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from "react-redux";
import PaymentCardMP from './paymentCardMP';
// import PaymentCardIC from './paymentCardIC';


export default function Payment() {
    // const country = useSelector(state => state.userAuthReducer.location)
    return (
        <div>
            {/* {country === "AR"? <PaymentCardMP />: <PaymentCardIC />} */}
            <PaymentCardMP />
        </div>
    )
}
