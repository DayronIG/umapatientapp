
import React, { useState } from 'react';
import TrasladosWelcome from './TrasladosWelcome';
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
