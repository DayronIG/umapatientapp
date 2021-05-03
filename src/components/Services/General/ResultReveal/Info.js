import React, { useRef } from 'react'
import { GenericHeader } from '../../../GeneralComponents/Headers'
import { useHistory } from 'react-router-dom'
import ReactToPrint from 'react-to-print'
import resultIcon from '../../../../assets/img/hisopados_list.svg'
import './ResultReveal.scss'
import ConstancyTrigger from '../Constancy/Trigger'

const Info = ({ finalAction, constancy }) => {
    const history = useHistory()
    const constRef = useRef()

    return (
        <>
            <GenericHeader />
            <div className="white-background">
                <div className="instructions-container">
                    <img src={resultIcon} alt="result" className="result-icon" />

                    <p className="title">Conoce tu resultado</p>
                    <p className="text">Ya se encuentra a tu disposición el resultado de tu hisopado</p>

                    <div onClick={() => finalAction()} className="blue-button">
                        Ver resultado
                    </div>

                    <div onClick={() => history.push('/')} className="blue-button">
                        Ir al inicio
                    </div>

                    <ConstancyTrigger rowData={constancy} CustomButton={<div className="blue-text">Descargar constancia</div>} />
                </div>
            </div>
        </>
    )
}

export default Info