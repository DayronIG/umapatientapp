import React, { useState } from 'react';
import VideoComponent from '../../Inputs/Video';
import PictureComponent from '../../Inputs/Picture'

const Assessment = ({ assessment, answersId, seti, setj, i, j, dispatch }) => {

  const [rangeValue, setRangeValue] = useState(30);

  const saveInputAndNext = (e, id, tag = '') => {
    e.preventDefault()
    let a = e.target.elements.inputValue.value + ' ' + tag
    saveAnswerAndNext('', a, id)
  }

  const saveAnswerAndNext = (q, a, id) => {
    let string = `${a}. `, answers = []
    answers = answersId.concat(id)
    dispatch({ type: 'SAVE_ANSWERS', payload: string })
    dispatch({ type: 'SAVE_ANSWERS_ID', payload: answers })
    
    if (assessment.selectedQuestions[j + 1]) {
      setj(j + 1)
    } else {
      seti(0)
      setj(0);
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: {} });
      dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: null });
    }
  }

  const stopAndNext = () => {
    if (assessment.selectedQuestions[j + 1]) {
      setj(j + 1)
    } else {
      seti(0)
      setj(0);
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: {} });
      dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: null });
    }
  }

  const inputType = (a, index) => {
    switch(assessment.currentQuestion.answerType) {
      case "select": {
        if(a.question.includes('rango')){
          return (
            <div className="range-confirm" key={index}>
              <div className="form-group">
                <label>{rangeValue}</label>
                <input type="range" className="form-control-range form-control text" min="30" max="200" onChange={(e) => setRangeValue(e.target.value)} />
              </div>
              <div className='btn btn-blue-lg mt-1 p-2'
              onClick={(e) => saveAnswerAndNext(assessment, rangeValue, assessment.currentQuestion.id)}>
                Confirmar
              </div>
            </div>
          );
        } else {
          return (
            <div className='btn btn-blue-lg mt-1 p-2' key={index}
              onClick={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id)}>
              {a.question}
            </div>
          )
        }
      }
      case "float": {
        return (
          <form onSubmit={(e) => saveInputAndNext(e, assessment.currentQuestion.id)} key={index}>
            <input type='number' className='form-control text' id='inputValue' name='inputValue' />
            <button type='submit' className='btn btn-blue-lg mt-1 p-2'>Enviar</button>
          </form>
        )
      }
      case "video": {
        return <VideoComponent key={index} isModal={true} finalAction={stopAndNext} />
      }
      case "photo": {
        return <PictureComponent key={index} finalAction={stopAndNext} />
      }
    }
  }

  return (
    <>
      {
        assessment.currentQuestion.answers.map((a, index) => inputType(a, index)
        )
      }
    </>
  )
}

export default Assessment
