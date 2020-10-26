import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import DeliverySelectDesiny from "../../DeliveryService/DeliverySelectDestiny"
import { handleAddressValidForHisopado } from "../../../store/actions/deliveryActions"

export default function AddressPickerHisopado({finalAction}) {
    const dispatch = useDispatch();

    useEffect(() => {
        //CHEQUEAR QUE LA DIRECC CUMPLA CON EL RADIO DE COVERTURA
        // dispatch(handleAddressValidForHisopado(isValid))
    }, [])

    return  (
    <div>
        <div className="hisopados-flux-container">
            <DeliverySelectDesiny finalAction={() => finalAction()} />
        </div>
        
    </div>)
}
