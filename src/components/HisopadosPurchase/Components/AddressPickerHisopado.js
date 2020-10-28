import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DeliverySelectDesiny from "../../DeliveryService/DeliverySelectDestiny"
import { handleAddressValidForHisopado } from "../../../store/actions/deliveryActions"
import axios from 'axios'

export default function AddressPickerHisopado({ finalAction }) {
    const dispatch = useDispatch();
    const { addressLatLongHisopado } = useSelector(state => state.deliveryService)

    useEffect(() => {
        //CHEQUEAR QUE LA DIRECC CUMPLA CON EL RADIO DE COVERTURA
        const distanceEndpoint = `http://localhost:8080/delivery/isDistanceValidForHisopado`
        console.log(addressLatLongHisopado)
        axios.post(distanceEndpoint, {lat: addressLatLongHisopado.lat, lng: addressLatLongHisopado.lng})
        .then(content => {
            const isValid = content.data.isValid
            console.log(isValid)
            dispatch(handleAddressValidForHisopado(isValid))
        }) 
        .catch(err => console.log(err))
    }, [addressLatLongHisopado])

    return (
        <div className="allwhite-hisopados-background">
                <DeliverySelectDesiny finalAction={() => finalAction()} />
        </div>)
}
