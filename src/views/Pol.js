import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PolProcedure from '../components/Pol/PolProcedure';
import PolWelcome from '../components/Pol/PolWelcome';
import PolProof from '../components/Pol/PolProof';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import Backbutton from '../components/GeneralComponents/Backbutton';
import Loading from '../components/GeneralComponents/Loading';
import { getUserPolData } from '../store/actions/firebaseQueries';
import '../styles/pol/Pol.scss';

const Pol = (props) => {
	const user = useSelector((state) => state.queries.patient);
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
			default:
				break;
		}
	}

	// useEffect(() => {
	//   renderComponent('Loading')
	//   if (user) {
	//     try {
	//       getUserPolData(user.dni)
	//         .then(function (userData) {
	//           console.log(userData)
	//           // pol no in userData when user enters first time and registerDone === no when user entered register but didnt finished.
	//           if (!("pol" in userData) || (userData.pol.registerDone === "no")) renderComponent("PolRegister")
	//           // when user completed register
	//           else if (("pol" in userData) && (userData.pol.registerDone === "si")) renderComponent("PolCheck")
	//           // still need one more condition if user already did POL.
	//           else {
	//             alert("Ya usted realizó le Fe de vida.")
	//             props.history.replace(`/${user.dni}`)
	//           }
	//         })
	//         .catch(function (error) {
	//           alert("Hubo un error al traer su información")
	//           props.history.replace('/')
	//         })
	//     } catch (error) {
	//       alert("Hubo un error al procesar la request.")
	//       props.history.replace('/')
	//     }
	//   } else {
	//     props.history.replace('/')
	//   }
	// }, [user])

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
