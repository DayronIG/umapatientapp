import React from 'react';

const Assessment = ({ assessment, answersId, seti, setj, i, j, dispatch }) => {

  const saveInputAndNext = (e, id, tag) => {
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

  return (
    <>
      {
        assessment.currentQuestion.answers.map((a, index) => (
          <div className='btn btn-blue-lg mt-1 p-2' key={index}
            onClick={(e) => saveAnswerAndNext(assessment, a.label, assessment.currentQuestion.id)}>
            {a.question}
          </div>
        ))
      }
    </>
  )
}

export default Assessment
