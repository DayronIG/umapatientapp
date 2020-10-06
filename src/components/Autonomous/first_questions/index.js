import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uid from '../api_uid';
import axios from 'axios';
import {TRIAGE_UMA} from '../../../config/endpoints';
import Video from '../../Inputs/Video';
import Loading from '../../GeneralComponents/Loading';
import swal from 'sweetalert';

export default ({ questions }) => {
  const patient = useSelector(state => state.queries.patient);
  // const token = useSelector(state => state.userActive.token)
  const autonomous = useSelector(state => state.autonomous)
  const [actualQuestion, setActualQuestion] = useState({});
  const [qList, setQlist] = useState([]);
  const [restart, setRestart] = useState(false);
  const [firstStepEnd, setFirstStepEnd] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Al montar el componente convierto el objeto en un array para poder iterar las preguntas
    let question_list = [];
    let keyList = Object.getOwnPropertyNames(questions)
    keyList.forEach((position) => {
      // Me aseguro que el tipo se object para ignorar el assignation_id, lat y lon que viene como string
      if(typeof questions[position] !== "string"){
        return (question_list.push(questions[position]))
      } else if (position === "99") {
        dispatch({ type: 'AUTONOMOUS_ASSIGNATION_ID', payload: questions[position] })
      }
    })
    setActualQuestion({ position: 0, content: question_list[0] });
    setQlist(question_list)
  }, [dispatch, questions])

  const nextQuestion = (resx) => {
    let newPosition = actualQuestion.position + 1;
    const parsed_date = patient.dni !== '' ? patient.dni : uid.getUid();
    if(qList[newPosition] && (typeof qList[newPosition]['1'] === "object")) {
      setFirstStepEnd({ ...firstStepEnd, [actualQuestion.position]: `${actualQuestion.content['0']} .${resx}` })
      if (newPosition >= qList.length) {
        setRestart(true)
        postQA1(parsed_date, resx)
      } else {
        setActualQuestion({ position: newPosition, content: qList[newPosition] });
      }
    } else if (typeof qList[newPosition] === "string") { // El assignation_id se guarda aparte y se saltea la pregunta
      let lastPosition = newPosition + 1;
      setActualQuestion({ position: lastPosition, content: qList[lastPosition] })
    } else {
      postQA1(parsed_date, resx, resx)
    }
  }

  const postQA1 = (parsed_date, resx, biomarker = []) => {
    setLoading(true);
    dispatch({
      type: 'AUTONOMOUS_SET_VALIDATION_LIST',
      payload: { answers: Object.values({ ...firstStepEnd, [actualQuestion.position]: `${actualQuestion.content['0']} .${resx}` }) }
    })
    let URL = `${TRIAGE_UMA}/autonomous_next`;
    let data = {
      biomarker: autonomous.biomarker.length > 0 ? autonomous.biomarker : biomarker,
      dni: parsed_date || '',
      key: '0',
      lab_id: autonomous.assignation_id || '',
      lat: '',
      lon: '',
      qa1: Object.values({ ...firstStepEnd, [actualQuestion.position]: `${actualQuestion.content['0']} .${resx}` }),
      qa_next: [],
      qa_acumulado: []
    }
    axios.post(URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      dispatch({ type: 'AUTONOMOUS_SET_QA_NEXT', payload: { pregunta: [res.data.pregunta], respuesta: res.data.respuesta } })
      dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'detail_questions' } })
    }).catch((e) => {
      setLoading(false)
      if(e.data?.error === 'AuthorizationHeaderError') {
        swal('No tienes autorización', 'Asegurate de estar logueado', 'warning')
      }
      swal('Error', 'Ocurrió un error en la conexion a internet, por favor vuelva a intentar más tarde', 'warning')
      dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'welcome' } })
    })
  }

  const setBiomarker = (link)  => {
    let newBiomarker = [...autonomous.biomarker, link]
    dispatch({ type: 'AUTONOMOUS_SET_BIOMARKER', payload: newBiomarker })
    nextQuestion(newBiomarker)
  }

  const backQuestion = () => {
    const newPosition = actualQuestion.position - 1;
    setActualQuestion({ position: newPosition, content: qList[newPosition] });
  }

  const restartAll = () => {
    dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'welcome' } })
  }

  function renderQuestions(answers) {
    if(answers[0] === "video") {
      return <Video isModal={true} finalAction={(link) => setBiomarker(link)} />
    } else {
      return (
      <div className="contentQuestionWrapper">
        <div className={"question"}>
          {actualQuestion.content['0']}
        </div>
        <div className="responseWrapper">
        {answers.map((possible_response, index) => {
          return (
            <div 
              key={possible_response + '' + index + actualQuestion.position} 
              id={possible_response + '' + index + actualQuestion.position} 
              className={'possible-response fadeIn animated'}>
              <button 
                className="check-button" 
                onClick={() => nextQuestion(possible_response)}>
                  {possible_response}
              </button>
            </div>
        )})}
        </div>
      </div>)
    }
  }

  return (
    <div className={'fadeIn animated question-container'}>
      {!loading ? <div>
        {!restart ? <>
          <div className={'back-button'} disabled={actualQuestion.position === 0 || loading} onClick={backQuestion}></div></> :
          <div className={'return-button'} onClick={restartAll}>Volver al Inicio</div>}
        {actualQuestion.content && renderQuestions(actualQuestion.content['1'])}
      </div> : <Loading />}
    </div>
  )
}