import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Home from '../components/HomePage';
import {useParams} from 'react-router-dom';
import { getAuth } from '../store/actions/firebaseQueries';

const HomeView = () => {
  const dispatch = useDispatch()
  const {ws} = useParams()

  useEffect(() => {
    if(ws) {
      getAuth(ws).then(res => {
        dispatch({type: 'GET_PATIENT', payload: res})
      })
    }
  }, [ws])

  return <Home />
}

export default HomeView
