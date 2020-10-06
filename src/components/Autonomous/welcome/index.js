
import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import uid from '../api_uid';
import logo from '../../../assets/icon.png';
import Backbutton from '../../GeneralComponents/Backbutton';
import {TRIAGE_UMA} from '../../../config/endpoints';
import '../../../styles/autonomous/welcome.scss';

export default (props)=>{
    const [ firstAnswer , setFirstAnswer ] = useState('');
    const [ loading , setLoading ] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state => state.userActive.token)
    const patient = useSelector(state => state.queries.patient);
    const [tags, ] = useState([
        {label: "Tos"},
        {label: "Resfrío"},
        {label: "Fiebre"},
        {label: "Dolor de cabeza"},
        {label: "Dolor de panza"},
        {label: "Vómitos"},
        {label: "Dolor de garganta"},
        {label: "Diarrea"}
    ])

    const handleSubmit = e => {
        e.preventDefault();
        const parsed_date = patient.dni !== '' ? patient.dni : uid.getUid();
        postSimpthoms(parsed_date, firstAnswer);
    }

    const postSimpthoms = (parsed_date) => {
        setLoading(true);
        let URL = `${TRIAGE_UMA}/autonomous`;
        axios.post(URL, {
            ws: patient.ws || '',
            dni: parsed_date,
            sex: patient.sex || '',
            dob: patient.dob || '',
            motivo_de_consulta: firstAnswer,
            lat: '',
            lon: ''
        },{
            headers:{ 
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then((res)=>{
            dispatch({type:'AUTONOMOUS_SET_FIRST_PREDICT', payload:res.data})
            dispatch({type:'AUTONOMOUS_SET_STEP', payload: {active:'first_questions'}})
        }).catch((e)=>{
            console.error(e);
            setLoading(false);
            alert('Ocurrió un error inesperado, por favor vuelva a intentar más tarde.')
        })
    }

    const handleInputChange = e =>{
        let newValueInput = e;
        if((firstAnswer.slice(-1)===' ' && newValueInput.slice(-1) === ' ') ){
            return;
        }
        let spaceCount = (newValueInput.split(" ").length - 1);
        spaceCount <= 19 && newValueInput.length < 500 && setFirstAnswer(newValueInput);
    }

    const addTag = (label) => {
        let newValue = firstAnswer.concat(" - " + label)
        setFirstAnswer(newValue)
    }

    return (
        <div className="autonomous-welcome">
            <Backbutton />
            {!props.isModal && 
            <div className="question">
                <p className="autonomous-welcome-title"><strong>¡Hola!</strong>&nbsp;Soy <img src={logo} className="autonomous-welcome-umalogo" alt="UMA" /></p>
            </div>}
            <div className="search-container">
                <div className="search-title">
                    <b>¿Cómo te sientes hoy?</b>
                </div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="search-input">
                        <input className="search-input" type="text" value={firstAnswer} placeholder="Ingrese sus síntomas" onChange={e => handleInputChange(e.target.value)} />
                        <div className="tags-container">
                        {tags.map((tag) => {
                            return (<div className="tag" key={tag.label} onClick={() => addTag(tag.label)}>
                                <span className="tag-text">{tag.label}</span>
                            </div>)
                        })}
                        </div>
                    </div>
                </form>
            </div>
            <div className="search-footer">
                <button className="check-button" type="submit" disabled={firstAnswer.length < 3 || loading} onClick={(e) => handleSubmit(e)}> 
                    Consultar
                </button>
            </div>
        </div>
    )
}
