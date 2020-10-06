import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faFrown, faMeh } from '@fortawesome/free-solid-svg-icons';
import isIos from '../Utils/isIos';
import Modal from '../GeneralComponents/Modal/MobileModal';
import VideoInput from '../Inputs/Video';
import personDown from '../../assets/difficulty-breathing.svg';
import personHappy from '../../assets/happy.svg';

const SymptomsTracking = ({ setFaces, setFever, setDyspnoea, faces, fever, dyspnoea }) => {
    const [covidModal, setCovidModal] = useState(true)

    return (
        <div className='symptomsTracking'>
            {covidModal && !isIos() && <Modal hideCloseButton={true}>
                <VideoInput 
                    isModal={true} 
                    finalAction={() => 
                        setCovidModal(false)}
                    />
            </Modal>}
            <h4>¿Cómo te sientes hoy?</h4>
            <div className='symptomsTracking__container'>
                <div className={'symptomsTracking__container--icon ' + (faces === 'worst' && 'selected')}
                    onClick={() => setFaces('worst')}>
                    <label htmlFor='overallFeelingWorst'>
                        <FontAwesomeIcon icon={faFrown} className='red' /><br />
                        <span className='overallText red'>Peor que ayer</span>
                    </label>
                </div>
                <div className={'symptomsTracking__container--icon ' + (faces === 'equal' && 'selected')}
                    onClick={() => setFaces('equal')}>
                    <label htmlFor='overallFeelingEqual'>
                        <FontAwesomeIcon icon={faMeh} className='neutral' /><br />
                        <span className='overallText neutral'>Igual que ayer</span>
                    </label>
                </div>
                <div className={'symptomsTracking__container--icon ' + (faces === 'better' && 'selected')}
                    onClick={() => setFaces('better')}>
                    <label htmlFor='overallFeelingBetter'>
                        <FontAwesomeIcon icon={faSmile} className='green' /><br />
                        <span className='overallText green'>Mejor que ayer</span>
                    </label>
                </div>
            </div>
            <hr />
            <h4>¿Has tenido fiebre?</h4>
            <span className='fiber__subtitle mt-2'>(Más de 38 grados)</span>
            <div className='symptomsTracking__container'>
                <div className={'symptomsTracking__container--fiberStatus ' + (fever === 'yes' && 'selected')}>
                    <button className='umacareBtn' onClick={() => setFever('yes')}>Si</button>
                </div>
                <div className={'symptomsTracking__container--fiberStatus ' + (fever === 'no' && 'selected')}>
                    <button className='umacareBtn' onClick={() => setFever('no')}>No</button>
                </div>
                <div className={'symptomsTracking__container--fiberStatus ' + (fever === 'idk' && 'selected')}>
                    <button className='umacareBtn' onClick={() => setFever('idk')}>No se</button>
                </div>
            </div>
            <hr />
            <h4>¿Cuánta falta de aire tienes?</h4>
            <div className='symptomsTracking__container'>
                <div className='symptomsTracking__container--slider'>
                    <Slider
                        defaultValue={1}
                        getAriaValueText={(e) => setDyspnoea((e / 100).toString())}
                        aria-labelledby='discrete-slider'
                        valueLabelDisplay='auto'
                        step={5}
                        min={0}
                        max={100}
                    />
                </div>
            </div>
            <div className='symptomsTracking__dyspnoea'>
                <img src={personHappy} alt='' />
                <img src={personDown} alt='' />
            </div>
        </div>
    )
}

export default SymptomsTracking


