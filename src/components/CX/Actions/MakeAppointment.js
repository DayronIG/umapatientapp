import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const MakeAppointment = () => {

  const dispatch = useDispatch()

  return (
    <>
      <p className="question">¿Desea realizar una nueva consulta?</p>

      <div>
        <Link 
          onClick={ () => {
            dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
          }}
          to={'/appointmentsonline/who'} className="btnSI"
        >Si</Link>
  
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

export default MakeAppointment
