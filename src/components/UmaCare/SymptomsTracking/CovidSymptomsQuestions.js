/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import covidUmacare from '../../../config/covidUmacare.json';

const CovidSymptomsQuestions = (props) => {
    const { userUmacareStatus, umacare } = useSelector(state => state.queries)
    const dispatch = useDispatch()
    const [renderQuestion, setRenderQuestion] = useState(0)
    const { questionsHandler } = props

    const handleRes = (position, value, val) => {
        let helper = userUmacareStatus ? userUmacareStatus : ''
        helper = helper.split('///')
        helper[position] = value
        helper = helper.reduce((prev, actual) => prev ? prev.concat(`///${actual}`) : actual, '')
        dispatch({ type: 'SET_UMACARE_STATUS', payload: helper })
        if (position === 3 ||  position === 2) {
            questionsHandler(false)
        }
        if(value === "no" || value === "negative") {
            questionsHandler(false)
        }
    }
    
    useEffect(() => {
        if(umacare?.mr_diagnostico === "INESP   Contacto estrecho COVID19" 
            || umacare?.mr_diagnostico === "INESP   Confirmado COVID19 x epidemiol"
            || umacare?.mr_diagnostico === "INESP   Confirmado COVID19 x hisopado") {
                questionsHandler(false)
            }
        if (userUmacareStatus) {
            if (renderQuestion === 0 && userUmacareStatus.split('///')[0] !== '') {
                if (userUmacareStatus.split('///')[0] === 'yes' || userUmacareStatus.split('///')[0] === 'no') {
                    setRenderQuestion(1)
                } else {
                    questionsHandler(false)
                }
            } else if (renderQuestion === 1 && userUmacareStatus.split('///')[1] !== '') {
                if (userUmacareStatus.split('///')[1] === 'positive') {
                    questionsHandler(false)
                }
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
        } else {
            questionsHandler(false)
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


