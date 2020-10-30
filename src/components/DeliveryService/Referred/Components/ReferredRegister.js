
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {GenericHeader} from '../../../GeneralComponents/Headers';

const ReferredRegister = () => {
    const dispatch = useDispatch();

    function goToNextStep() {
        dispatch({type: 'SET_PAGINATION_TRANSPORT', payload: 2})
    }

    return (
        <>
            <GenericHeader>Registro</GenericHeader>
            <div className="referred-register">
                <div>
                    <div>
                        <div>Discapacidad</div>
                    </div>
                    <input className="form-control" 
                        value={''} 
                        onChange={(e) => dispatch({type: 'ADD_DISABILITY', payload: e.target.value})} 
                    />
                        </div>
                        <div>
                            <button 
                                className="blue-button"
                                onClick={() => goToNextStep()}>
                                Enviar
                            </button>
                    </div>
            </div>
        </>
    ) 
}

export default ReferredRegister;
