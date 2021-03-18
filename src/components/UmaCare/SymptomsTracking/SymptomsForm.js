import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import isIos from '../../Utils/isIos';
import CovidSymptomsQuestions from './CovidSymptomsQuestions';
import CovidMainQuestions from './CovidMainQuestions';
import axios from 'axios';
import { node_patient } from '../../../config/endpoints';

const SymptomsTracking = ({ sendTracking }) => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.userActive.currentUser)
    const user = useSelector(state => state.user)
    const [faces, setFaces] = useState()
    const [fever, setFever] = useState()
    const [dyspnoea, setDyspnoea] = useState()
    const [coordinates, setCoordinates] = useState({lat: '', lon: ''})
    const [askQuestions, setAskQuestions] = useState(true)
    const posOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    const watchError = () => console.log('Hubo un error al rastrear la posición')

    const currentPos = ({ coords }) => {
        dispatch({type: "SET_COORDS", payload:
            {
                lat: coords.latitude.toString() || '',
                lon: coords.longitude.toString() || ''
            }})
        setCoordinates({
            lat: coords.latitude.toString() || '',
            lon: coords.longitude.toString() || '',
        })
        currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
            let data = {
                newValues: {
                    lat: coords.latitude.toString() || '',
                    lon: coords.latitude.toString() || '',
                }}
            axios
                .patch(`${node_patient}/update/${currentUser.uid}`, data,  {headers: headers })
                .then((res) => {
                    console.log("UMA");
                })
                .catch((err) => {
                    console.log(err);
                });
            })
    }

    useEffect(() => {
        try {
            if (!isIos) {
                navigator.permissions.query({ name: 'geolocation' })
                    .then(function (result) {
                        if (result.state === 'granted') {
                            navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions)
                        } else if (result.state === 'prompt') {
                            navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions)
                        } else if (result.state === 'denied') {
                            setCoordinates({
                                latitude: '',
                                longitude: ''
                            })
                        }
                    })
                    .catch(err => {
                        setCoordinates({
                            latitude: '',
                            longitude: ''
                        })
                    })
            } else {
                navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions)
            }
        } catch (err) {
            console.log(err)
            setCoordinates({
                lat: '',
                lng: ''
            })
        }
    }, [])
    

    return (
        <>
            {askQuestions ?
                <CovidSymptomsQuestions questionsHandler={setAskQuestions} />
                :
                <>
                    <CovidMainQuestions
                        faces={faces} setFaces={setFaces}
                        fever={fever} setFever={setFever}
                        dyspnoea={dyspnoea} setDyspnoea={setDyspnoea}
                    />
                    <FooterBtn text='Enviar' callback={() => sendTracking({ faces, fever, dyspnoea, ...coordinates })} />
                </>
            }
        </>
    )
}

export default SymptomsTracking


