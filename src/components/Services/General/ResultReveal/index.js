import React, { useRef } from 'react'
import { GenericHeader } from '../../../GeneralComponents/Headers'
import { useHistory } from 'react-router-dom'
import ReactToPrint from 'react-to-print'
import resultIcon from '../../../../assets/img/hisopados_list.svg'
import './ResultReveal.scss'

const ResultReveal = ({ action = () => {}, headerTitle = '', }) => {
    const history = useHistory()
    const constRef = useRef()

    return (
        <>
            <GenericHeader children={headerTitle} />
            <div className="white-background">
                <div className="instructions-container">
                    <img src={resultIcon} alt="result" className="result-icon" />

                    <p className="title">Conoce tu resultado</p>
                    <p className="text">Ya se encuentra a tu disposición el resutlado de tu hisopado</p>

                    <div onClick={() => action()} className="blue-button">
                        Ver resultado
                    </div>

                    <div onClick={() => history.push('/')} className="blue-button">
                        Ir al inicio
                    </div>

                    <ReactToPrint
                        trigger={() => (
                            <div className="blue-text">Descargar constancia</div>
                        )}
                        content={() => constRef.current}
                    />

                    {
                        false && false &&
                        <div className="hisopado-results-contancy-dowloader">
                            {/* <ConstancyHisopado id={docId} patient={user} date={date} result={result} ref={constRef} /> */}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ResultReveal