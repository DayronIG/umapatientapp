/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import { CovidSteps } from './CovidSteps';
import Steper from './Steper';
import { activateUmacareTraking } from '../../store/actions/umaCareActions';
import moment from 'moment-timezone';

const SelectedTracking = ({setTextDetail}) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const patient = useSelector(state=> state.user)
    const umacare = useSelector(state=> state.umacare)
    const [color, setColor] = useState('');
    const [percent, setPercent] = useState(0);
    const [result, setResult] = useState()
    const [steperTitle, setSteperTitle] = useState("Estado Actual")

    useEffect(() => {
        let actual = umacare.allTrackings[umacare.selectedTracking]
        getStep(actual)
        getDays(actual)
    }, [umacare])

    const getDays = (actual) => {
        let days = Object.keys(actual.resp);
        let size = days.length
        let current = days.findIndex(el => {
            if(el === moment().subtract(1, 'days').format("YYYY-MM-DD") ||
            el === moment().format("YYYY-MM-DD")){
                return true
            } else {
                return false
            }
        })
        current = ++current
        if(current === -1 || umacare.activeTracking.length === 0) {
            setPercent(100);
            setSteperTitle("Umacare ya ha finalizado")
        } else {
            setSteperTitle(`Estado actual. Día ${current} de ${size}`)
        }
    }

    const getStep = (actual) => {
        let { resp } = actual
        if(actual.status !== undefined) {
            let [ hisopado, result, cuarentena ] = actual?.status?.split('///');
            if ( result === 'idky' || result === undefined) result = '';
            setResult(result)
            if(actual.status === '' || actual.status === 'no'){
                setPercent(0)
            } else if(hisopado === 'yes') {
                setPercent(35);
            } else if (result === 'positive' || result === 'negative') {
                setPercent(70) 
            } else if (cuarentena) {
                setPercent(71) 
            } else if(actual.active !== 'ok') {
                setPercent(100);
            }
            let keys = Object.keys(resp);
            for (let i = keys.length; i >= 0; i--) {
              if(resp[keys[i]] && resp[keys[i]].faces !== "") {
                let face = resp[keys[i]].faces   
                if (face === "better") {
                  setColor('green')
                } else if (face === "equal") {
                  setColor('yellow')
                } else if (face === "worst") {
                  setColor('red')
                } 
                break
              } else {
                setColor('gray')
              }
            }
        }
    }

    const activateHandler = async () => {
        await activateUmacareTraking(patient.id)
        dispatch({type: 'UMACARE_SET_ACTIVE', payload: 0})
    }

    const goToUmacare = () => {
        history.push(`/${patient.ws}/umacare/${moment().format('YYYY-MM-DD')}/${umacare.allTrackings[umacare.selectedTracking]?.id}`)
    }
    return(
        <div className="tracking__container">
            <Steper percent={percent} color={color} result={result} title={steperTitle} />
            <div className={`tracking__detail ${color ? color : 'gray'}`}>
                <CovidSteps percent={percent}
                    setTextDetail={(text) => setTextDetail(text)} result={result} />
                {umacare.activeTracking.length === 0 && (
                    <div className="buttonActionContainer">
                        <button onClick={activateHandler} >
                            Activar nuevo seguimiento
                        </button>
                    </div>
                )}
            </div>            
            {umacare.allTrackings[umacare.selectedTracking]?.active === "ok" &&
                <div className="tracking__status">
                    <h3>Realizar reporte diario</h3>
                    <p>Realiza el test diario para actualizar tu estado de salud y completar el seguimiento.</p>
                    <button type="button"
                            onClick={() => goToUmacare()}>
                        Comenzar
                    </button>
                </div>
            }

      </div>
    )
}

export default SelectedTracking;