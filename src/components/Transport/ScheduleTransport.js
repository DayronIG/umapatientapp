import React, { useState } from 'react';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { useSelector, useDispatch } from 'react-redux';
import * as transportActions from '../../store/actions/transportActions';
import { useHistory, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import DaysSlider from '../GeneralComponents/DaysSlider';
import DaysSlider2 from '../GeneralComponents/DaysSlider2';
import Loading from '../GeneralComponents/Loading';
import moment from 'moment';
import '../../styles/transport/scheduleTransport.scss';

function ScheduleTransport() {
	const { loading } = useSelector(state => state.front)
	const transportData = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const { ws } = useParams();
	const [today] = useState(moment().format('YYYY-MM-DD'));
	const [tomorrow] = useState(moment().add(1, 'day').format('YYYY-MM-DD'));
	const dispatch = useDispatch();
	const history = useHistory();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			dispatch({ type: 'LOADING', payload: true });
			await transportActions.createTransportSchedule(transportData, patient);
			await swal('Éxito', 'Traslado creado con éxito', 'success');
			dispatch({ type: 'LOADING', payload: false });
			history.push(`/${ws}/transportUserActive`);
		} catch (error) {
			console.error(error);
			dispatch({ type: 'LOADING', payload: false });
			swal('Error', 'Hubo un error al crear su traslado. Por favor, intente de nuevo', 'warning');
		}
	}
	if(!transportData.hasReturn){
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'fri', value: ''}})
	}

	

	return (
		<form className='scheduleForm'>
			{loading && <Loading />}
			
			<div className='scheduleForm__container'>
				<div className='scheduleForm__container--input'>
				
					<label>Fecha desde:</label>
					<input
						required
						min={today}
						type='date'
						value={transportData.start_date}
						onChange={transportActions.setStartDate}
					/>
				</div>
				<div className='scheduleForm__container--input'>
					<label>Fecha hasta:</label>
					<input
						required
						min={tomorrow}
						type='date'
						value={transportData.end_date}
						onChange={transportActions.setEndDate}
					/>
				</div>
			</div>
			<div className='scheduleForm__container'>
				<div className="centeredElements">
				<h5 className='scheduleForm__container--title'>Horario</h5>
				<label htmlFor='scheduleReturn'>Ida y vuelta:</label> {' '}
				<input
					type='checkbox'
					onChange={transportActions.setHasReturn}
					id='scheduleReturn'
					name='scheduleReturn'
					value={transportData.hasReturn}
				/>
				</div>
			<DaysSlider
				title='Llegada a destino'
				values={transportData.startSchedules}
				handleChange={transportActions.setStartSchedule}
			/>

			{transportData.hasReturn && (
				<DaysSlider2
					title='Regreso a origen'
					values={transportData.returnSchedules}
					handleChange={transportActions.setReturnSchedule}
				/>
			)}
			</div>
			
			<div className='scheduleForm__container'>
				<div className="scheduleForm__observations"> 
					<h5>Observaciones</h5>
					<input
						type='text'
						placeholder='Escribe tus comentarios aquí...'
						name='notes'
						id='notes'
						// value={transportData.notes}
						// onChange={transportActions.setNotes}
					/>
				</div>
			</div>
			<div className="centeredElements">
			<FooterBtn
				callback={handleSubmit}
				text='Confirmar'
				type='submit'
			/>
			</div>
		</form>
	);
}

export default ScheduleTransport;