import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DB, {firebaseInitializeApp} from '../../../src/config/DBConnection';
import queryString from 'query-string'
import { withRouter, useParams, useLocation } from 'react-router-dom';
import { mp_payment_url_refunds } from "../../config/endpoints";






const PaymentRefund = () => {
    const [state, setstate] = useState()
    const db = DB.firestore(firebaseInitializeApp);
    let headers = { 'Content-Type': 'Application/Json', 'Authorization': localStorage.getItem('token') }
    const location = useLocation()
	const params = queryString.parse(location.search)

    
    const getPayments = async () => {
        const payments = await db.collection('services/bills/guardia').where('uid', '==', 'YKvCPGFoQleoHwUzhFOknwn8Lfm2').get();
        const response = axios.post(mp_payment_url_refunds, {
            uid: 'YKvCPGFoQleoHwUzhFOknwn8Lfm2',
        }, { headers })
        let arr = [];
        // payments.forEach(doc => {
        //     const data = doc.data();
        //     arr.push(data)
        // })
        console.log('res', response)
        setstate(arr)
    }

    useEffect(() => {
        getPayments();
    },[])
    console.log('state', state)


    return (
        <h1>HOLA NICO</h1>
    )
}

export default PaymentRefund;