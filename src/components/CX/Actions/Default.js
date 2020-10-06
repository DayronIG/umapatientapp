import React from 'react'
import { useDispatch } from 'react-redux'

const Default = () => {

  const dispatch = useDispatch()

  return (
    <>
      <p className="question">¿Pregunta por Default?</p>

      <div>
        <button 
          // onClick={ () => dispatch({ type: 'TOGGLE_MODAL_ACTION' }) } 
          className="btnSI"
        >Si</button>
        
        <button 
          onClick={ () => {
            dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
          }}
          className="btnNO"
        >No</button>
      </div>
    </>
  )
}

export default Default
