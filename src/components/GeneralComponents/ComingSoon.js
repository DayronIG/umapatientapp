import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GenericHeader } from './Headers';
import underConstruction from '../../assets/icons/underConstruction.png'
import Backbutton from './Backbutton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import medicAtHome from "../../assets/icons/cuidadoDomiciliario.png";
import FooterBtn from '../GeneralComponents/FooterBtn';
import "../../styles/homeCare/homeCare.scss";
import "../../styles/SoonContent.scss";

export const CuidadosDomiciliariosBack = (props) => {
    return (
        <div className='soon-content'>
            <div onClick={() => props.setInfo(false)} className="soon-info">
                <FontAwesomeIcon icon={faInfoCircle} className="tag-icon" />
            </div>
            <p className="contentInfo">Estamos trabajando para disponibilizarte el servicio mas avanzado e innovador de cuidados domiciliarios con el que podrás:</p>
            <ul>
                <li>Gestionar horarios y citas de cuidadores, enfermeros y médicos. </li>
                <li>
                    monitorear en tiempo real, las 24 horas del día, los 7 dias de la semana, la salud y bienestar de la persona bajo cuidados.
                </li>
            </ul>
        </div>
    )
}
export const TurnosEnConsultorio = (props) => {
    return (
        <div className='soon-content'>
            <div onClick={() => props.setInfo(false)} className="soon-info">
                <FontAwesomeIcon icon={faInfoCircle} className="tag-icon" />
            </div>
            <p>Próximamente en este módulo podrás</p>
            <ul>
                <li>Reservar turnos en el consultorio que prefieras.</li>
                <li>Llevar registro de tus atenciones.</li>
                <li>Personalizar recordatorios de tus citas.</li>
            </ul>
        </div>
    )
}

const ComingSoon = (props) => {
    const [info, setInfo] = useState(false)
    const [param, setParam] = useState("")
    React.useEffect(() => {
        let url = props.history
        let section = props.history.location.search.split("coming=")
        setParam(section[1])
    }, [])

    return (
        <>
            <div className="comingSoonContainer">
                {!info ?
                    <>
                        {param === "cuidados" ?
                            <div className="homeCare">
                                <div className="homeCare__container position-relative" onClick={() => setInfo(true)}>
                                    <FontAwesomeIcon
                                        className="homeCare__container--icon"
                                        icon={faInfoCircle}
                                    />
                                </div>
                                <div className="homeCare__container">
                                    <img
                                        src={medicAtHome} alt=""
                                        className="homeCare__container--img"
                                    />
                                </div>
                                <div className="homeCare__container">
                                    <h4 className="homeCare__container--title">
                                        Cuidados domiciliarios
                                    </h4>
                                </div>
                                <div className="homeCare__container">
                                    <p className="homeCare__container--text">
                                        Accede a cuidadores, enfermeros y médicos para tener un servicio personalizado y completo en tu hogar.
                  </p>
                                </div>
                            </div>
                            :
                            <div className='soon-content'>
                                <div onClick={() => setInfo(true)} className="soon-info">
                                    <FontAwesomeIcon icon={faInfoCircle} className="tag-icon" />
                                </div>
                                <h1 className='h13'>Próximamente!</h1>
                                <h4 className='h33'>Esta sección está en construcción actualmente</h4>
                                <div className='img3'>
                                    <img src={underConstruction} alt="en construcción" />
                                </div>
                            </div>
                        }
                    </>
                    :
                    <CuidadosDomiciliariosBack setInfo={() => setInfo()} />
                }
                <FooterBtn
                    mode="single"
                    text="Volver"
                    callback={() => props.history.push('/home')}
                />
            </div>
        </>
    )
}
export default withRouter(ComingSoon);