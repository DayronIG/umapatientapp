import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DeliverySelectDesiny from "../../DeliveryService/DeliverySelectDestiny"
import { handleAddressValidForHisopado } from "../../../store/actions/deliveryActions"
import { is_distance_valid_for_hisopado }from "../../../config/endpoints"
import axios from 'axios'

export default function AddressPickerHisopado({ finalAction }) {
    const dispatch = useDispatch();
    const { addressLatLongHisopado } = useSelector(state => state.deliveryService);

    useEffect(() => {
        //CHEQUEAR QUE LA DIRECC CUMPLA CON EL RADIO DE COVERTURA
        console.log(addressLatLongHisopado)
        axios.post(is_distance_valid_for_hisopado, {lat: addressLatLongHisopado.lat, lng: addressLatLongHisopado.lng})
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
