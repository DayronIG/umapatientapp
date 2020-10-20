import React, { useState } from 'react';
import VideoComponent from '../../Inputs/Video';
import PictureComponent from '../../Inputs/Picture';
import InputFloat from '../../Inputs/Float';
import OptionButton from '../../Inputs/Option';
import InputRange from '../../Inputs/Range';

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
      dispatch({ type: 'CLEAN_SYMPTOM' });
    }
  }

  const stopAndNext = () => {
    if (assessment.selectedQuestions[j + 1]) {
      setj(j + 1)
    } else {
      seti(0)
      setj(0);
      dispatch({ type: 'CLEAN_SYMPTOM' });
    }
  }

  const inputType = (a, index) => {
    switch(assessment.currentQuestion.answerType) {
      case "select": {
        if(a.question.includes('rango')){
          return (
            <div className="range-confirm" key={index}>
              <InputRange value={rangeValue} action={(e) => setRangeValue(e.target.value)} />
              <OptionButton action={(e) => saveAnswerAndNext(assessment, rangeValue, assessment.currentQuestion.id)} text="Confirmar" />
            </div>
          );
        } else {
          return <OptionButton action={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id)} text={a.question} key={index} />
        }
      }
      case "float": return <InputFloat submit={(e) => saveInputAndNext(e, assessment.currentQuestion.id)} key={index} />
      case "video": {
        // TODO: A veces después de cortar la grabación vuelve a la pregunta inicial.
        return <VideoComponent key={index} isModal={true} finalAction={stopAndNext} />
      }
      case "photo": return <PictureComponent key={index} finalAction={stopAndNext} />
    }
  }

  return (
    <>
      {
        assessment.currentQuestion.answers.map((a, index) => inputType(a, index))
      }
    </>
  )
}

export default Assessment
