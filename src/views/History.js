/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyRecords from '../components/MyRecords/MyRecords';
import Record from '../components/MyRecords/Record'
import { getMedicalRecord, getBenficiaries } from '../store/actions/firebaseQueries';

const History = (props) => {
  const dispatch = useDispatch();
  const patient = useSelector(state => state.user)

  useEffect(() => {
    let local = JSON.parse(localStorage.getItem('userData'))
    let p = local.dni || patient.group
    if(patient.ws !== "") {
      dispatch(getBenficiaries(p))
      dispatch(getMedicalRecord(p, patient.ws))
    }
  }, [patient.dni, patient.ws])

  if (props.match.params.record) {
    return <Record dni={props.match.params.dni} aid={props.match.params.record} />
  } else {
    return <MyRecords /> 
  }
}

export default History;