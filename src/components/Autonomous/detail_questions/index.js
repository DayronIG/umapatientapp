/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uid from '../api_uid';
import axios from 'axios';
import {TRIAGE_UMA} from '../../../config/endpoints';
import Loading from '../../GeneralComponents/Loading';
import swal from 'sweetalert';

export default ({ answers, assignation, biomarkers, qa_next, qa_acumulado }) => {
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.userActive.token)
  const patient = useSelector(state => state.user)
  const dispatch = useDispatch();

  const nextQuestion = (resx) => {
    const parsed_date = patient.dni !== '' ? patient.dni : uid.getUid();
    getNewQuestion(parsed_date, resx);
  }

  const getNewQuestion = (parsed_date, resx) => {
    setLoading(true);
    let URL = `${TRIAGE_UMA}/v2/autonomous_next`;
    axios.post(URL, {
      biomarker: biomarkers || '',
      dni: parsed_date,
      lab_id: assignation || '',
      lat: answers.lon || '',
      lon: answers.lat || '',
      qa1: answers || '',
      qa_next: [`${qa_next.pregunta} .${resx}`],
      qa_acumulado: [...qa_acumulado.last, `${qa_next.pregunta} .${resx}`],
      key: qa_next.key ? qa_next.key : '0',
      uid: patient.core_id,
      uid_dependant: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    }).then((res) => {
      if (res.data.key === 'end') {
        dispatch({ type: 'AUTONOMOUS_SET_FINAL_PREDICT', payload: res.data })
        dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'predict' } })
      } else {
        dispatch({ type: 'AUTONOMOUS_SET_QA_ACUMULADO', payload: { last: [...qa_acumulado.last, `${qa_next.pregunta} .${resx}`] } })
        dispatch({ type: 'AUTONOMOUS_SET_QA_NEXT', payload: { pregunta: [res.data.pregunta], respuesta: res.data.respuesta, key: res.data.key } })
        setLoading(false);
      }
    }).catch((e) => {
      setLoading(false);
      swal('Ocurrió un error con la conexion, por favor vuelva a intentar más tarde.')
      dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'welcome' } })
    })
  }

  useEffect(()=>{
    //SKIPPING LAST QUESTION
    if(qa_next.pregunta[0] === "¿Tiene algún otro síntoma?"){
      nextQuestion(qa_next.respuesta[0])
    }
  }, [qa_next])

  return (
    <div className={'fadeIn animated question-container'}>
      {
        !loading ? <div>
          {qa_next.pregunta.length > 0 && (<div>
            <div className={"question"}>
              {qa_next.pregunta}
            </div>
            <div className="responseWrapper">
              {qa_next.respuesta.map((possible_response, index) => {
                return (<div key={possible_response + '' + index} id={possible_response + '' + index} className={'fadeIn animated'}>
                  <button className={'check-button'} onClick={() => nextQuestion(possible_response)}>{possible_response}</button>
                </div>)
              })}
            </div>
          </div>)}
        </div> : <Loading />
      }
    </div>
  )
}