/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import headUp from '../../assets/pol/headUp.svg';
import headCenter from '../../assets/pol/headCenter.svg';
import headDown from '../../assets/pol/headDown.svg';

const PolInstructions = () => {
    const dispatch = useDispatch()
    const [head, setHead] = useState('headCenter')

    useEffect(() => { setTimeout(() => changeImg(), 3000) }, [head])

    function changeImg() {
        if (head === "headDown") {
            setHead("headUp")
        } else if (head === "headUp") {
            setHead("headCenter")
        } else if (head === "headCenter") {
            setHead("headDown")
        }
    }

    return (
        <div className={'modalWrapper'}>
            <div className="darkBackground" />
            <div className="modalContent">
                <div className="animationWrapper">
                    <div>
                        <div className="imageHelper">
                            {head === 'headUp' && <img src={headUp} alt="helper-a" />}
                            {head === 'headCenter' && <img src={headCenter} className="centerFace" alt="helper-b" />}
                            {head === 'headDown' && <img src={headDown} alt="helper-c" />}
                        </div>
                    </div>
                </div>
                <div className="accept">
                    <button
                        className="btn btn-active"
                        onClick={() => dispatch({ type: 'POL_SHOW_INSTRUCTIONS', payload: false })}
                    >
                        Entendí las instrucciones
                    </button>
                </div>
                <div className="instructionsWrapper"><strong>Instrucciones:</strong> coloque su rostro en el círculo y mueva la cabeza afirmativamente (hacia arriba y abajo)</div>
            </div>
        </div>
    )
}

export default PolInstructions;