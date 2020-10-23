/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import covidUmacare from '../../config/covidUmacare.json';

const CovidSymptomsQuestions = ({ setAskQuestions }) => {
    const { userUmacareStatus, umacare } = useSelector(state => state.queries)
    const dispatch = useDispatch()
    const [renderQuestion, setRenderQuestion] = useState(0)

    const handleRes = (position, value, val) => {
        let helper = userUmacareStatus ? userUmacareStatus : ''
        if(value === "no") {
            setRenderQuestion(3)
            setAskQuestions(false)
        }
        helper = helper.split('///')
        helper[position] = value
        helper = helper.reduce((prev, actual) => prev ? prev.concat(`///${actual}`) : actual, '')
        dispatch({ type: 'SET_UMACARE_STATUS', payload: helper })
        if (position === 3) setAskQuestions(false)
    }
    
    useEffect(() => {
        if(umacare?.mr_diagnostico === "INESP   Contacto estrecho COVID19" 
            || umacare?.mr_diagnostico === "INESP   Confirmado COVID19 x epidemiol"
            || umacare?.mr_diagnostico === "INESP   Confirmado COVID19 x hisopado") {
                setAskQuestions(false)
            }
        if (userUmacareStatus) {
            if (renderQuestion === 0 && userUmacareStatus.split('///')[0] !== '') {
                if (userUmacareStatus.split('///')[0] === 'yes' || userUmacareStatus.split('///')[0] === 'no') {
                    setRenderQuestion(1)
                } else {
                    setAskQuestions(false)
                }
            } else if (renderQuestion === 1 && userUmacareStatus.split('///')[1] !== '') {
                if (userUmacareStatus.split('///')[1] === 'positive') {
                    setRenderQuestion(2)
                } else {
                    setAskQuestions(false)
                }
            } else if (renderQuestion === 2 && userUmacareStatus.split('///')[2] !== '') {
                setTimeout(() => setAskQuestions(false), 500)
            }
        }
    }, [userUmacareStatus])

    useEffect(() => {
        if (!userUmacareStatus) {
            setRenderQuestion(0)
        } else if (userUmacareStatus && userUmacareStatus.split('///')[0] === 'no') {
            setRenderQuestion(0)
        } else if (userUmacareStatus && userUmacareStatus.split('///')[1] === 'idky') {
            setRenderQuestion(1)
        } else if (userUmacareStatus && userUmacareStatus.split('///')[1] === 'positive') { //  && daysDiff >= 9
            setRenderQuestion(2)
        } else if (userUmacareStatus && userUmacareStatus.split('///')[2] === 'home') {
            setAskQuestions(false)
        } else {
            setAskQuestions(false)
        }
    }, [])
    
    return (
        <div className='symptomsTracking'>
            {covidUmacare.map((item, index) => {
                    return (
                        <div key={index}>
                            {renderQuestion === index ? <>
                            <h4>{item.question}</h4>
                            <div className='symptomsTracking__container'>
                                <div className='symptomsTracking__container--fiberStatus'>
                                    {item.responses.map((res, i) => (
                                        <button type='button' key={`${i}${res.value}`} 
                                            onClick={() => handleRes(index, res.value, userUmacareStatus)} 
                                            className='umacareBtn'>
                                            {res.label.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            </> : ""}
                        </div>
                    )
                }
            )}
        </div>
    )
}

export default CovidSymptomsQuestions


