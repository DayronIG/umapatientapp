import React from 'react'
import './MktHeader.scss'

const MktHeader = ({title, price, text}) => {
    return (
        <div className="mktHeader">
            <h1>{title}</h1>
            <p className="price">${price}</p>
            <p className="text">{text}</p>
        </div>
    )
}

export default MktHeader