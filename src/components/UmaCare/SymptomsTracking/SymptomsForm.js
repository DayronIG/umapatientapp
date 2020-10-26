import React, { useState, useEffect } from 'react';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import isIos from '../../Utils/isIos';
import CovidSymptomsQuestions from './CovidSymptomsQuestions';
import CovidMainQuestions from './CovidMainQuestions';

const SymptomsTracking = ({ sendTracking }) => {
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
        setCoordinates({
            lat: coords.latitude.toString() || '',
            lon: coords.longitude.toString() || '',
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
                <CovidSymptomsQuestions setAskQuestions={setAskQuestions} />
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


