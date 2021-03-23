/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from 'react-router-dom';
import MyRecords from '../components/MyRecords/MyRecords';
import Record from '../components/MyRecords/Record'
import { getMedicalRecord, getBenficiaries } from '../store/actions/firebaseQueries';

const History = (props) => {
  const dispatch = useDispatch();
  const {dni, record} = useParams();
  const patient = useSelector(state => state.user)
  const {currentUser} = useSelector(state => state.userActive)

  useEffect(() => {
    if(patient.ws !== "") {
      dispatch(getBenficiaries(currentUser.uid))
      dispatch(getMedicalRecord(currentUser.uid, false))
    }
  }, [patient.dni, patient.ws])

  if (record) {
    return <Record dni={dni} aid={record} />
  } else {
    return <MyRecords /> 
  }
}

export default History;