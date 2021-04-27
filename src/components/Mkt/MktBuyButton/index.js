import React from 'react'
import './MktBuyButton.scss'

const MktBuyButton = ({children, action}) => {
    return (
        <button className="MktBuyButton" onClick={() => action()}>{children}</button>
    )
}

export default MktBuyButton