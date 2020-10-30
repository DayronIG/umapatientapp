import React from 'react'
import DeliverySelectDesiny from "../../../DeliveryService/DeliverySelectDestiny"

export default function AddressPickerHisopado({ finalAction }) {
    return (
        <div className="allwhite-hisopados-background">
                <DeliverySelectDesiny finalAction={() => finalAction()} />
        </div>)
}
