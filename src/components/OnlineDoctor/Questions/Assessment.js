import React, { useState } from 'react';
import VideoComponent from '../../Inputs/Video';
import PictureComponent from '../../Inputs/Picture';
import InputFloat from '../../Inputs/Float';
import OptionButton from '../../Inputs/Option';
import InputRange from '../../Inputs/Range';

const Assessment = ({ assessment, answersId, seti, setj, i, j, dispatch }) => {

  const [rangeValue, setRangeValue] = useState(0);

  const saveInputAndNext = (e, id, tag = '') => {
    e.preventDefault()
    let a = e.target.elements.inputValue.value + ' ' + tag
    saveAnswerAndNext('', a, id)
  }

  const saveAnswerAndNext = (q, a, id, priority, rangeValue = null) => {
    if(rangeValue) {
      if(a.includes('{range}')) {
        a = a.replace('{range}', rangeValue);
      } else if(a.includes('(ppm)')) {
        a = `${a} ${rangeValue}`;
      }
    }

    let string = `${a}. `, answers = []
    answers = answersId.concat(id)
    
    if(priority === "1") {
      string += ' #ALERTA';

      dispatch({ type: 'SAVE_ANSWERS', payload: string });
      dispatch({ type: 'SAVE_ANSWERS_ID', payload: answers });

      seti(0);
      setj(0);
      dispatch({ type: 'CLEAN_SYMPTOM' });
      return;
    }

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

  const stopQuestions = () => {
    seti(0)
    setj(0);
    dispatch({ type: 'CLEAN_SYMPTOM' });
  }

  const inputType = (a, index) => {
    switch(assessment.currentQuestion.input.type) {
      case "select": return <OptionButton action={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id, a.priority)} text={a.question} key={index} />
      case "range": {
        if(a.question.includes('range')){
          return (
            <div className="range-confirm" key={index}>
              <InputRange 
                min={assessment.currentQuestion.input.min} 
                max={assessment.currentQuestion.input.max}  
                value={rangeValue || assessment.currentQuestion.input.min} 
                action={(e) => setRangeValue(e.target.value)}
                unit={assessment.currentQuestion.input.unit} 
              />
              <OptionButton action={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id, a.priority, rangeValue)} text="Confirmar" />
            </div>
          );
        } else {
          return <OptionButton action={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id, a.priority)} text={a.question} key={index} />
        }
      }
      case "float": return <InputFloat submit={(e) => saveInputAndNext(e, assessment.currentQuestion.id)} key={index} />
      case "video": {
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
      {assessment.currentQuestion.showSkip && <button className="skipBtn" onClick={stopQuestions}>Omitir preguntas restantes</button>}
    </>
  )
}

export default Assessment
