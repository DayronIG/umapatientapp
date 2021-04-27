import React from 'react'
import './MktTextBlock.scss'

const MktTextBlock = ({title, children}) => {
    return (
        <div className="mktTextBlock">
            <h2>{title}</h2>
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default MktTextBlock