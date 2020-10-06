import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { COVID } from './helpers';
import covidSymptoms from '../../../config/covidSymptoms.json';
import Buttons from './Buttons';

function CovidModal({ history, setResponseIA }) {
    const { selectedSymptoms } = useSelector(state => state.assessment);
    const [formState, setFormState] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        let helper = []
        try {
            selectedSymptoms.forEach(selectedSymp => {
                const equals = covidSymptoms.find(symp => symp.tag.toUpperCase() === selectedSymp.toUpperCase())
                if (!!equals) helper.push(equals.tag)
            })
            setFormState([...formState, ...helper])
        } catch (error) {
            // console.error(error)
        }
    }, [])

    const handleChange = (event, label) => {
        let helper = [...formState]
        let biomarker = {
            [label]: event ? 'yes' : 'no'
        }
        dispatch({type: 'SET_ASSESSMENT_BIOMARKER', payload: biomarker })
        if (event === true) {
            helper.push(label)
            if (!formState.includes(label)) return setFormState(helper)
        } else {
            helper = formState.filter(item => item !== label && item)
            return setFormState(helper)
        }
    }

    const submitSymptoms = async e => {
        e.preventDefault()
        let answers = [];
        if (formState.length > 0) {
            answers = formState.reduce((prev, actual) => !!prev && `${prev}. `.concat(actual)).concat('. ')
            dispatch({ type: 'SAVE_ANSWERS', payload: answers })
        }
        setResponseIA(COVID(formState))
    }

    return (
        <form className='symptoms' onSubmit={submitSymptoms}>
            <p className="subtitulo-modal">Complete el siguiente cuestionario</p>
            {covidSymptoms.map((symp, index) => (
                <div className='symptoms__container' key={index}>
                    <div className='symptoms__container--question'>
                        {symp.front}
                    </div>
                    <div className='symptoms__container--buttons'>
                        <Buttons handleChange={handleChange} symp={symp} />
                    </div>
                </div>
            ))}
            <button type='submit' className='btnVolver'>
                Confirmar síntomas
            </button>
            <button type="button" className='btnVolver' onClick={() => {
                history.push('/');
            }}>
                Cancelar
            </button>
        </form>
    )
}

export default withRouter(CovidModal)
