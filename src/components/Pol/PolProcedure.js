import React, { useState } from 'react';
import PolRegister from './PolRegister';
import { PolErrorRegister, PolProofSuccess, PolDeniedRegister } from './PolResponse';
import { withRouter } from 'react-router-dom';
import Steps from './Steps';
// import { useSelector } from 'react-redux';
// import { Switch } from 'react-switch';

const PolProcedure = (props) => {
	const [step, setStep] = useState('instructionsFirstStep');
	function renderPol() {
		switch (step) {
			case 'instructionsFirstStep':
				return (
					<div className='pol-instructions'>
						<Steps step='1' goToStep={() => setStep('instructionsSecondStep')} />
					</div>
				);
			case 'instructionsSecondStep':
				return (
					<div className='pol-instructions'>
						<Steps step='2' goToStep={() => setStep('register')} />
					</div>
				);
			case 'register':
				return (
					<div className='pol-dni'>
						<PolRegister goToStep={(result) => setStep(result)} />
					</div>
				);
			case 'success':
				return (
					<div className='pol-success'>
						<PolProofSuccess polRegister={true} goHome={() => props.history.replace('/')} />
					</div>
				);
			case 'failure':
				return (
					<div className='pol-failure'>
						<PolErrorRegister
							polRegister={true}
							goHome={() => props.history.replace('/')}
							goToStep={() => setStep('instructionsFirstStep')}
						/>
					</div>
				);
			case 'denied':
				return (
					<div className='pol-denied'>
						<PolDeniedRegister polRegister={true} goHome={() => props.history.replace('/')} />
					</div>
				);
			default:
				break;
		}
	}
	return <>{renderPol()}</>;
};

export default withRouter(PolProcedure);
