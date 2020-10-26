import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DeliverySelectDesiny from "../../DeliveryService/DeliverySelectDestiny"
import { handleAddressValidForHisopado } from "../../../store/actions/deliveryActions"
import axios from 'axios'

export default function AddressPickerHisopado({ finalAction }) {
    const dispatch = useDispatch();
    const { addressLatLongHisopado } = useSelector(state => state.deliveryService)

    useEffect(() => {
        console.log(addressLatLongHisopado)
        //CHEQUEAR QUE LA DIRECC CUMPLA CON EL RADIO DE COVERTURA
        const distanceEndpoint = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${addressLatLongHisopado.lat},${addressLatLongHisopado.lng}&destinations=${addressLatLongHisopado.lat},${addressLatLongHisopado.lng}&key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs`
        fetch(distanceEndpoint)
        .then(res => console.log(res)) 
        // dispatch(handleAddressValidForHisopado(isValid))
    }, [addressLatLongHisopado])

    return (
        <div>
            <div className="hisopados-flux-container">
                <DeliverySelectDesiny finalAction={() => finalAction()} />
            </div>

        </div>)
}
