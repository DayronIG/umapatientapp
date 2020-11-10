/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PolProcedure from '../components/Pol/PolProcedure';
import PolWelcome from '../components/Pol/PolWelcome';
import PolProof from '../components/Pol/PolProof';
import Loading from '../components/GeneralComponents/Loading';
import '../styles/pol/Pol.scss';

const Pol = (props) => {
	const [componentToRender, setComponentToRender] = useState({ path: '', component: <div></div> });

	function renderComponent(componentToRender) {
		switch (componentToRender) {
			case 'Loading':
				setComponentToRender({ path: 'Loading', component: <Loading /> });
				break;
			case 'PolWelcome':
				setComponentToRender({
					path: 'PolWelcome',
					component: <PolWelcome setPath={() => renderComponent('PolRegister')} />,
				});
				break;
			case 'PolRegister':
				setComponentToRender({ path: 'PolRegister', component: <PolProcedure /> });
				break;
			case 'PolCheck':
				setComponentToRender({ path: 'PolCheck', component: <PolProof ws={props.match.params.ws} /> });
				break
			default:
				break;
		}
	}
	useEffect(() => {
		renderComponent('PolRegister');
	}, []);

	return (
		<>
			{/*(componentToRender.path !== 'POLCheck') && <Backbutton />*/}
			<section className='pol-container'>{componentToRender.component}</section>
		</>
	);
};

export default withRouter(Pol);
