import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../../GeneralComponents/Alert/Alerts';
import '../../../styles/questions.scss';

const QueueActions = (props) => {
	const dispatch = useDispatch()
    const [alert, setAlert] = useState(false)

    return (
		<div className="questionsContainer">
			{	
				alert && 
				<Alert
					alertType="question"
					titleMessage="Cancelar cita"
					customMessage="¿Está seguro que desea cancelar la consulta?"
					handleConfirm={() => props.setShowModalCancelOptions(true)}
					handleReject={() => setAlert(false)}
					customAction={() => setAlert(false)}
				/>
			}
			{/* Adjuntar archivo */}
			{ 
				props.calling &&
				<Link to={`/${props.dni}/onlinedoctor/attention/`} replace={true}>
					<button className="btn-questions btn-calling" onClick={() => setAlert(true)}>Ingresar al consultorio</button>
				</Link>
			}
			{	
				props.appState !== 'ATT' && props.appState !== 'DONE' && !props.calling && 
				<button className="btn-questions btn-alert" onClick={() => setAlert(true)}>Cancelar consulta</button>
			}
			{	
				props.appState === 'DONE' && 
				<h2>El médico ya cerró tu consulta.</h2>
			}
			<button className="btn-questions btn-claim" onClick={() => dispatch({ type: 'TOGGLE_DETAIL' })}>Realizar un reclamo</button>
		</div>
	)
}

export default QueueActions;