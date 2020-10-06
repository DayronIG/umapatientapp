import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {GenericHeader} from '../GeneralComponents/Headers';
import Welcome from './welcome';
import FirstStep from './first_questions';
import DetailQuestions from './detail_questions';
import Predict from './predict';
import '../../styles/autonomous/autonomous.scss';

const Autonomous = (props) => {
    const step = useSelector((state)=>state.autonomous.current_step);
    const {assignation_id, qa_next, first_predict, biomarker,
        to_predict, qa_acumulado, final_predict} = useSelector((state)=>state.autonomous);
    const user = useSelector(state => state.queries.patient);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.dni) {
            let user
            user = JSON.parse(localStorage.getItem('userData'))
            dispatch({type: 'GET_PATIENT', payload: user})
        }
    }, [])

    return (
        <>
            {!props.isModal &&
                <>
                    <GenericHeader>Autonomous</GenericHeader>
                </>
            }
            <div className="autonomous">
                {step.active === 'welcome' && <Welcome isModal={props.isModal} />}
                {step.active === 'first_questions' && <FirstStep questions={first_predict} ></FirstStep>}
                {step.active === 'detail_questions' 
                    && <DetailQuestions
                        assignation={assignation_id}
                        answers={to_predict.answers}
                        biomarkers={biomarker}
                        qa_next={qa_next} 
                        qa_acumulado={qa_acumulado} />}
                {step.active === 'predict' && <Predict predicted={final_predict}></Predict>}
            </div>
        </>
    )
}

export default Autonomous;