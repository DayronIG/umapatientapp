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
    if (assessment.selectedQuestions[i][j + 1]) setj(j + 1)
    else if (assessment.selectedQuestions[i + 1]) {
      setj(0)
      seti(i + 1)
    } else {
      seti(j + 1)
    }
  }

  return (
    <>
      {
        assessment.currentQuestion.answers.map((a, index) => (
          <>
            {
              a.answer !== 'input' ?
              <div className='btn btn-blue-lg mt-1 p-2' key={index}
                onClick={(e) => saveAnswerAndNext(assessment, a.tag, assessment.currentQuestion.id)}>
                {a.answer}
              </div>
              :
              <form onSubmit={(e) => saveInputAndNext(e, assessment.currentQuestion.id, a.tag)} key={index}>
                <input type='text' id='inputValue' name='inputValue' />
                <button type='submit' className='btn btn-blue-lg mt-1 p-2'>Enviar</button>
              </form>
            }
          </>
        ))
      }
    </>
  )
}

export default Assessment
