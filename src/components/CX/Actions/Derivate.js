import React from 'react'
import { useDispatch } from 'react-redux'

const Derivate = () => {

  const dispatch = useDispatch()

  return (
    <button 
      onClick={ () => {
        dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
      }}
      className="btn btn-blue w-100"
    >Aceptar</button>
  )
}

export default Derivate
