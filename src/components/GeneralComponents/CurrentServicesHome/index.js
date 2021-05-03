import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'

const CurrentServicesHome = ({ qty }) => {
    const history = useHistory()

    return (
        <div className="currentServices" onClick={() => history.push('/services/tracker')}>
            <p>{`Tienes ${qty} servicio${qty > 1 ? 's' : ''} activo${qty > 1 ? 's' : ''}`}</p>
            <FaChevronRight />
        </div>
    )
}

export default CurrentServicesHome