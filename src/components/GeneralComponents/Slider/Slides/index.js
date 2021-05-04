import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'

const Slide = ({title = '', text = '', price = '', img = '', cta = '', action = ''}) => {
    const history = useHistory()

    return (
        <div className="slide" onClick={() => history.push(action)}>
            <div className='twocolumns'>
                <div className="text">
                    <h1>{title}</h1>
                    <p>{text}</p>
                </div>
                <div className='price'>
                    <p>A sólo</p>
                    <h1>${price}</h1>
                </div>
            </div>
            <div className="img">
                <img src={img} alt={title} />
            </div>
            <div className="button">
                <button className="slide__btn">{cta} <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default Slide

