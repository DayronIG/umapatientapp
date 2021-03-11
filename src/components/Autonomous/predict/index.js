
import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {withRouter} from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import moment from 'moment-timezone';
import axios from 'axios';
import { feedback } from '../../../config/endpoints'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPhone } from "@fortawesome/free-solid-svg-icons";
import Alert from '../../GeneralComponents/Alert/Alerts';
import swal from 'sweetalert';
import { make_appointment } from '../../../config/endpoints';

const Predict = ({predicted, history})=>{
    const dispatch = useDispatch();
    const token = useSelector(state => state.userActive.token)
    const { uid } = useSelector(state => state.userActive.currentUser)
    const patient = useSelector(state => state.user)
    const autonomous = useSelector(state => state.autonomous)
    const [top, setTop] = useState(predicted.respuesta.replace(/"/g,' ').split("#", 6)); // .replace(/'"'])
    const [redirecting, setRedirecting] = useState(false)
    const [ratingApp, setRatingApp] = useState(0)

    const sendFeedback = () => {
        let headers = {'Content-Type': 'Application/Json'/* , 'Authorization': token */ }
        try {
            let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
            let user
            if(patient.dni) {
                user = patient
            } else {
                user = JSON.parse(localStorage.getItem('userData'))
            }
            const data = {
                'ws': user.ws,
                'dni': user.dni,
                'dt': date,
                'assignation_id': 'umadoc',
                'uma_eval': `${ratingApp.toString()}#${autonomous.final_predict.boton}`,
                'doc_eval': top[1],
                'notes': predicted.epicrisis,
                'uid': uid,
                'uid_dependant': false
            }
            axios.post(feedback, data, headers)
                .then((res) => {
                    restartAll();
                })
                .catch((err) =>{
                    console.log(err)
                })
        } catch (err) {
            // console.log(err);
            dispatch({type:'AUTONOMOUS_RESET'})
            dispatch({type: 'TOGGLE_DETAIL', payload: true})
            dispatch({type:'AUTONOMOUS_SET_STEP', payload:{active:'welcome'}})
        }
    }

    const restartAll = () => {
        dispatch({type:'AUTONOMOUS_RESET'})
        history.push(`/${patient.ws}/`)
    }

    function redirectNow() {
        window.location.href = `/onlinedoctor/who/${patient.ws}`;
    }

    async function _getOnlineAppointment() {
        dispatch({ type: 'LOADING', payload: true });
		try {
			let dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
			let data = {
				age: patient.dob || '',
				biomarker: [],
				destino_final: '',
				diagnostico: '',
				dt,
				dni: patient.dni,
				epicrisis: `${autonomous.final_predict.epicrisis}`,
				lat: patient.dni || '',
				lon: patient.lon || '',
				msg: 'make_appointment',
				motivo_de_consulta: `Derivación de consulta autónoma: ${autonomous.final_predict.epicrisis}`,
				alertas: '',
				ruta: '',
				sex: patient.sex || '',
				specialty: 'online_clinica_medica',
                ws: patient.ws,
                uid: patient.core_id,
                uid_dependant: false,
                category: 'GUARDIA_AUTONOMOUS'
			};
			const headers = { 'Content-type': 'application/json' };
			const res = await axios.post(make_appointment, data, headers);
			dispatch({ type: 'LOADING', payload: false });
            localStorage.setItem('currentAppointment', JSON.stringify(data.ruta));
            localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
            dispatch({type: 'TOGGLE_DETAIL', payload: false})
            return history.replace(`/onlinedoctor/queue/${patient.uid}?dependant=false`);
		} catch (err) {
			console.log(err)
			swal('Error', 'Hubo un error al agendar el turno, intente nuevamente', 'error');
			dispatch({ type: 'LOADING', payload: false });
		}
    }

    const AutonomousAction = () => {
        if(autonomous.final_predict.boton === "3"){
        return(
            <div className="sugested-action green" onClick={() => _getOnlineAppointment()}>
                <div className="suggested-title">
                    <span>{autonomous.final_predict.speech}</span>
                </div>
                <div className="suggested-ico">
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
        )
        } else if(autonomous.final_predict.boton === "2") {
            return(
                <div className="sugested-action yellow">
                    <div className="suggested-title">
                        <span>{autonomous.final_predict.speech}</span>
                    </div>
                </div>
            )
        } else if(autonomous.final_predict.boton === "1") {
            return(
                <a href={`tel:107`}>
                <div className="sugested-action red">
                    <div className="suggested-title">
                        <span>{autonomous.final_predict.speech} (Teléfono SAME: 107)</span>
                    </div>
                    <div className="suggested-ico">
                        <FontAwesomeIcon icon={faPhone} />
                    </div>
                </div>
                </a>
            )
        } else if(autonomous.final_predict.boton === "4") {
            return(
                <div className="sugested-action violet" onClick={() => _getOnlineAppointment()}>
                    <div className="suggested-title">
                        <span>{autonomous.final_predict.speech}</span>
                    </div>
                    <div className="suggested-ico">
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                </div>
            )
        }
    }
    return (
        <div className="autonomous-predict">
            {redirecting && <Alert alertType="success" titleMessage="Consulta Online" customMessage="Usted será redirigido al consultorio online." customAction={() => redirectNow()} />}
            <div className="container-predicts">
                <AutonomousAction />
                <div className="predict-container">
                    <div className="predict-title">Diagnóstico Primario</div>
                    <div className="predict-description">
                        {top[0].slice(0,-5)}
                    </div>
                    <div className="percentage-predict"> {`${top[1]}%`}</div>                   
                    <div className="epicrisis">
                    <div className="predict-title">Epicrisis</div>
                        <div className="predict-description">
                            <span>{predicted.epicrisis}</span>
                        </div>
                    </div>            
                </div>
                <div className="predict-container">
                    <div className="predict-title">Otros diagnósticos posibles</div>
                    <div className="secondary-predict-container">
                        <div className="secondary-predict">
                            <div className="predict-description">
                                {top[2].slice(0,-5)}
                            </div>
                            <div className="percentage-predict"> {`${top[3]}%`}</div>  
                        </div>
                        <div className="secondary-predict">
                            <div className="predict-description">
                                {top[4].slice(0,-5)}
                            </div>
                            <div className="percentage-predict"> {`${top[5]}%`}</div> 
                        </div>
                    </div>
                </div>
                <div className="predict-advisor">
                    Recuerde que este servicio corresponde sólo a información general y no es un diagnóstico médico individual.
                    Si sus síntomas persisten, cambian o empeoran consulte con un médico.
                </div>
                <div className="ratings-container text-center p5">
                    <label>¿Cómo evaluaría la experiencia?</label>
                        <StarRatings
                            rating={ratingApp}
                            changeRating={e => setRatingApp(e)}
                            numberOfStars={5}
                            name='rating'
                            starDimension="35px"
                            starRatedColor="#42A5F6"
                            starHoverColor="#0071F2"
                        />
                </div>
            </div>
            <button className={'btn btn-blue-lg'} onClick={(e) => sendFeedback(e)}>Enviar valoración</button>
            <button className={'btn btn-blue-lg'} onClick={(e) => restartAll(e)}>Volver al Inicio</button>
        </div>
    )
}

export default withRouter(Predict)