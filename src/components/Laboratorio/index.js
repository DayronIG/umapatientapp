import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Backbutton from '../GeneralComponents/Backbutton';
import { GenericHeader } from "../GeneralComponents/Headers";
import logo from '../../assets/icon.png';
import LoadAnalysis from "./Lab/Buttons";
import "../../styles/wellness/ocr.scss";

export default () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.queries.patient)

  useEffect(() => {
    if (!user.dni) {
      let user
      user = JSON.parse(localStorage.getItem('userData'))
      dispatch({ type: 'GET_PATIENT', payload: user })
    }
  }, [])

  return (
    <>
      <GenericHeader>Laboratorios</GenericHeader>
      <Backbutton />
      <div className="ocr">
        <div className="ocr-welcome">
          <div className="question">
            <p className="ocr-welcome-title"><strong>Analice sus exámanes de laboratorio en dos pasos </strong> </p>
            <LoadAnalysis />
          </div>
        </div>
      </div>
    </>
  )
};
