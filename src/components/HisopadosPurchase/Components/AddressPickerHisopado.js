import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DeliverySelectDesiny from "../../DeliveryService/DeliverySelectDestiny"
import { handleAddressValidForHisopado } from "../../../store/actions/deliveryActions"
import axios from 'axios'

export default function AddressPickerHisopado({ finalAction }) {
    const dispatch = useDispatch();
    const { addressLatLongHisopado } = useSelector(state => state.deliveryService)
    const melianLatLong = {lat: -34.713364263890426, lng: -58.26911104550783}

    useEffect(() => {
        //CHEQUEAR QUE LA DIRECC CUMPLA CON EL RADIO DE COVERTURA
        // const distanceEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${addressLatLongHisopado.lat},${addressLatLongHisopado.long}&key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs`
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const distanceEndpoint = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${melianLatLong.lat},${melianLatLong.lng}&destinations=${addressLatLongHisopado.lat},${addressLatLongHisopado.lng}&key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs`
        console.log(distanceEndpoint)
        fetch(proxyurl + distanceEndpoint)
        .then(res => res.json())
        .then(content => console.log(content)) 
        .catch(err => console.log(err))
        // dispatch(handleAddressValidForHisopado(isValid))
    }, [addressLatLongHisopado])

    return (
        <div>
            <div className="hisopados-flux-container">
                <DeliverySelectDesiny finalAction={() => finalAction()} />
            </div>

        </div>)
}
