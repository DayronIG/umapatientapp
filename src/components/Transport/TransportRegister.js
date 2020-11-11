
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrasladosWelcome from './TrasladosWelcome';
// import FirstStep from '../../views/Register';
import SecondStep from './TransportOnboardingSecondStep';
import ThirdStep from './TransportOnboardingThirdStep';
import BackButton from '../GeneralComponents/Backbutton'
import RegisterForm from './RegisterForm'
import '../../styles/generalcomponents/TransportMain.scss';

const TransportWrapperComponent = (props) => {
	const [welcome, setWelcome] = useState(true)

	return (
		<>

			{welcome ?
				<TrasladosWelcome startTraslados={() => setWelcome(false)} />
				:
				<RegisterForm />
			}
		</>
	);
}

export default TransportWrapperComponent;
