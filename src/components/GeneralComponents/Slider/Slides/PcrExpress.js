import React from 'react'
import { useSelector } from "react-redux";
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'

const PcrExpress = () => {
    const history = useHistory()
    const price = useSelector((state) => state.deliveryService.params?.price);
    const corporate = useSelector((state) => state.user?.corporate_norm);

    return (
        <div className="slide" onClick={() => history.push('/hisopado/type')}>
            <div className="text">
                <h1>Nuevo PCR Express</h1>
            </div>
            <div className="button">
                <button className="slide__btn">Quiero mi hisopado <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default PcrExpress