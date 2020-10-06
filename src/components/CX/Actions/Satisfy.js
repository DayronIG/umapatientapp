import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {cx_user_response} from '../../../config/endpoints';
import axios from 'axios';
import '../../../styles/cx/CX.scss'

const Satisfy = (props) => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.userActive.token)
  const cx = useSelector(state => state.cx.cx)

  const sendSatisfy = (response) => {
    let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': token */ }
    axios.post(cx_user_response, {path: cx.path, user_response: response, headers})
    dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
    if(response === "no") {
      dispatch({ type: 'TOGGLE_DETAIL' })
    }
  }
  
  return (
    <>
      <p className="question">¿Estás satisfecho con la respuesta?</p>
      <div>
        <button
          onClick={() => { sendSatisfy('si')} }
          className="btnSI">Si</button>

        <button
          onClick={() => {sendSatisfy('no')} }
          className="btnNO">No</button>
      </div>
    </>
  )
}

export default Satisfy
