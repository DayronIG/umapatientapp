/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { GenericHeader } from '../GeneralComponents/Headers';
import PaymentCardMP from './paymentCardMP';
import PaymentCardPP from './paymentCardPP';
import Loader from "../GeneralComponents/Loading"

export default function Payment({finalAction}) {
    //DESCOMENTAR CUANDO PAYMENT SEA INTERNACIONAL

    // const {lat, lon} = useSelector(state => state.queries.patient)
    // const { country } = useSelector(state => state.queries.patient)
    // const dispatch = useDispatch()

    // useEffect(()=>{
    //     if(lat && lon){
    //         fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs`)
    //         .then(response => response.json())
    //         .then(pos => {
    //             dispatch({type: "SET_USER_COUNTRY", payload: getCountry(pos.results)})
        
    //         })
    //     }
    // }, [lat, lon])

    
    // function getCountry(results){
    //     for (var i = 0; i < results[0].address_components.length; i++)
    //     {
    //     var shortname = results[0].address_components[i].short_name;
    //     var longname = results[0].address_components[i].long_name;
    //     var type = results[0].address_components[i].types;
    //     if (type.indexOf("country") != -1)
    //     {
    //         if (!isNullOrWhitespace(shortname))
    //         {
    //             return shortname;
    //         }
    //         else
    //         {
    //             return longname;
    //         }
    //     }
    // }}


    // function isNullOrWhitespace(text) {
    //     if (text == null) {
    //         return true;
    //     }
    //     return text.replace(/\s/gi, '').length < 1;
    // }
    

    return (
        <div className="payment-container">
          {/* <GenericHeader children="Contratar Servicio" /> */}
            {/* {!country && <Loader/>} */}
            {/* {country === "AR"? <PaymentCardMP />: <PaymentCardPP />}  */}
            <PaymentCardMP />
        </div>
    )
}
