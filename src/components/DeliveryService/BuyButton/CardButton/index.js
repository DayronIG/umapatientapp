import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import './CardButton.scss'

const CardButton = ({ img, title, text, result, price, action }) => {
    return (
        <div className="cardButton" onClick={() => action()}>
            <div className="image">
                <img src={img} alt={title} />
            </div>
            <div className="infoCardButton">
                <div className="cardRow">
                    <h2>{title}</h2>
                    <p>{text}</p>
                    <p>{result}</p>
                </div>
                <div className="cardRowColums">
                    <p className="price">${price}</p>
                    <p className="action">Solicitar <FaChevronRight /></p>
                </div>
            </div>
        </div>
    )
}

export default CardButton