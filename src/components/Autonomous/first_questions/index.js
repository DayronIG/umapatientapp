import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uid from '../api_uid';
import axios from 'axios';
import {TRIAGE_UMA} from '../../../config/endpoints';
import Video from '../../Inputs/Video';
import AudioInput from '../../Inputs/Audio';
import CameraInput from '../../Inputs/Picture';
import Loading from '../../GeneralComponents/Loading';
import swal from 'sweetalert';

export default ({ questions }) => {
  const patient = useSelector(state => state.queries.patient);
  const token = useSelector(state => state.userActive.token);
  const autonomous = useSelector(state => state.autonomous);
  const [actualQuestion, setActualQuestion] = useState({});
  const [qList, setQlist] = useState([]);
  const [restart, setRestart] = useState(false);
  const [firstStepEnd, setFirstStepEnd] = useState({});
  const [loading, setLoading] = useState(false);
  const [answersToRender, setAnswersToRender] = useState([])
  const [changeMultimedia, setChangeMultimedia] = useState([])
  const dispatch = useDispatch();
  const allBiomarkers = useSelector(state => state.autonomous.allBiomarkers)
  const currentBiomarker = useSelector(state => state.autonomous.current_biomarker)

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

  useEffect(() => {
    if(allBiomarkers && answersToRender.length === 0 && currentBiomarker === "next"){
      nextQuestion(allBiomarkers, allBiomarkers);
      setAnswersToRender(["NO MORE POSTING"])
    }
  }, [allBiomarkers, currentBiomarker])
  
  const nextQuestion = (resx, newBiomarker) => {
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
      postQA1(parsed_date, resx, newBiomarker)
    }
  }

  const postQA1 = (parsed_date, resx, biomarkers = {}) => {
    setLoading(true);
    dispatch({
      type: 'AUTONOMOUS_SET_VALIDATION_LIST',
      payload: { answers: Object.values({ ...firstStepEnd, [actualQuestion.position]: `${actualQuestion.content['0']} .${resx}` }) }
    })
    let URL = `${TRIAGE_UMA}/autonomous_next`;
    let data = {
      biomarker: biomarkers,
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

  const setBiomarker = (type, link)  => {
    let newBiomarker = link;
    dispatch({ type: 'AUTONOMOUS_SET_BIOMARKERS', payload: newBiomarker });
    dispatch({ type: 'AUTONOMOUS_SET_ALL_BIOMARKERS', payload: newBiomarker });
  }

  const backQuestion = () => {
    const newPosition = actualQuestion.position - 1;
    setActualQuestion({ position: newPosition, content: qList[newPosition] });
  }

  const restartAll = () => {
    dispatch({ type: 'AUTONOMOUS_SET_STEP', payload: { active: 'welcome' } })
  }

  function renderQuestions(answers) {
      if(autonomous.current_biomarker === "video") {
        return <>
                <div className="skip-biomarker-container">
                  <button 
                  className="skip-biomarker-button" 
                  onClick={() => { 
                    setChangeMultimedia(true)
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  }}>
                  Omitir
                  </button>
                </div>
                <Video isModal={true} finalAction={(link) => {
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  setBiomarker("video", link)
                  setChangeMultimedia(true)
                  }}
                   />
              </>
      } else if(autonomous.current_biomarker === "audio_sthetoscope" && !!window.chrome) {
        return <>
                <div className="skip-biomarker-container">
                  <button 
                  className="skip-biomarker-button" 
                  onClick={() => { 
                    setChangeMultimedia(true)
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  }}>
                  Omitir
                  </button>
                </div>
                <AudioInput autonomus={true} modal={false} finalAction={(link) => {
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  setBiomarker("audio_sthetoscope", link)
                  setChangeMultimedia(true)
                  }} upload_url_prop={`${patient.dni}/autonomous/heartbeat`}/>

              </>
      } else if(autonomous.current_biomarker === "photo1") {
        return <>
                <div className="skip-biomarker-container">
                  <button 
                  className="skip-biomarker-button" 
                  onClick={() => { 
                    setChangeMultimedia(true)
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  }}>
                  Omitir
                  </button>
                </div>
                <CameraInput modal={true} finalAction={(link) => {
                  dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: "next"})
                  setBiomarker("photo1", link)
                  setChangeMultimedia(true)
                  }} />
              </>
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

  useEffect(() => {
    if (actualQuestion?.content){
      setAnswersToRender(actualQuestion?.content['1'])
    }
  }, [actualQuestion])

  useEffect(() => {
    if(answersToRender[0] === "audio_sthetoscope" && changeMultimedia){
      dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: answersToRender[0]})
      setAnswersToRender(answersToRender.filter(answer => answer !== answersToRender[0]))
      setChangeMultimedia(false)
    } else if(answersToRender[0] === "photo1" && changeMultimedia){
      dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: answersToRender[0]})
      setAnswersToRender(answersToRender.filter(answer => answer !== answersToRender[0]))
      setChangeMultimedia(false)
    } else if(answersToRender[0] === "video" && changeMultimedia){
      dispatch({type: "AUTONOMOUS_SET_CURRENT_BIOMARKER", payload: answersToRender[0]})
      setAnswersToRender(answersToRender.filter(answer => answer !== answersToRender[0]))
      setChangeMultimedia(false)
    }
  }, [answersToRender, changeMultimedia])

  return (
    <div className={'fadeIn animated question-container'}>
      {!loading ? <div>
        {!restart ? <>
          <div className={'back-button'} disabled={actualQuestion.position === 0 || loading} onClick={backQuestion}></div></> :
          <div className={'return-button'} onClick={restartAll}>Volver al Inicio</div>}
        {actualQuestion.content && renderQuestions(actualQuestion.content['1'])}
      </div> : 
      <Loading />}
    </div>
  )
}