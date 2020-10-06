
import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import TrasladosWelcome from './TrasladosWelcome';
import FirstStep from '../../views/Register';
import SecondStep from './TransportOnboardingSecondStep';
import ThirdStep from './TransportOnboardingThirdStep';

import '../../styles/generalcomponents/TransportMain.scss';

const TransportWrapperComponent = (props) => {
    const [welcome, setWelcome] = useState(true)
    const stepPosition = useSelector((state) => state.front.paginationTransport);

    function showStep() {
        return(
            <>
            <div className="stepsContainer d-flex justify-content-center">
                <div className={stepPosition === 1 ? "secondStep active" : "secondStep" }>1</div>
                <div className={stepPosition === 2 ? "thirdStep active" : "thirdStep" }>2</div>
            </div>
            </>
        ) 
    }        

    function goToStepForm() {
        if (stepPosition === 1) {
            return( <SecondStep/> )
        } else if (stepPosition === 2) {
            return( <ThirdStep props={props.props}/> )
        }
    }

    return (
        <>
            {welcome ?  <TrasladosWelcome startTraslados={() => setWelcome(false)}/> :
            <div className="transportWrapper">
                { showStep() }
                { goToStepForm() }
            </div>}
        </>
    )
}

export default TransportWrapperComponent;
