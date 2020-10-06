import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyRecords from '../components/MyRecords/MyRecords';
import Record from '../components/MyRecords/Record'
import { getMedicalRecord, getBenficiaries } from '../store/actions/firebaseQueries';

const History = (props) => {
  const dispatch = useDispatch();
  const patient = useSelector(state => state.queries.patient)

  useEffect(() => {
    let local = JSON.parse(localStorage.getItem('userData'))
    let p = patient.group || local.dni
    dispatch(getBenficiaries(p))
    dispatch(getMedicalRecord(p, patient.ws))
  }, [patient.dni, dispatch, patient.ws])

  if (props.match.params.record) {
    return <Record dni={props.match.params.dni} aid={props.match.params.record} />
  } else {
    return <MyRecords />
  }
}

export default History;