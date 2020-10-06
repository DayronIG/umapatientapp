import React from 'react'
import { useDispatch } from 'react-redux'

const PhoneCall = () => {

  const dispatch = useDispatch()

  return (
    <>
      <p className="question">¿Desea llamar a emergencias?</p>

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

export default PhoneCall
