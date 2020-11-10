import React, { useState } from 'react';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { useSelector, useDispatch } from 'react-redux';
import * as transportActions from '../../store/actions/transportActions';
import { useHistory, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import DaysSlider from '../GeneralComponents/DaysSlider';
import DaysSliderReturn from '../GeneralComponents/DaysSliderReturn';
import Loading from '../GeneralComponents/Loading';
import moment from 'moment-timezone';
import '../../styles/transport/scheduleTransport.scss';
import { days } from '../Utils/transportUtils';

function ScheduleTransport() {
	const { loading } = useSelector(state => state.front);
	const transportData = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const { ws } = useParams();
	const [today] = useState(moment().format('YYYY-MM-DD'));
	const [tomorrow] = useState(moment().add(1, 'day').format('YYYY-MM-DD'));
	const dispatch = useDispatch();
	const history = useHistory();

	const resetReturnDays = () => {
		dispatch({ type: 'SET_BACK_TRANSLATE_MONDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_TUESDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_WEDNESDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_THURSDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_FRIDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_SATURDAY', payload: false });
		dispatch({ type: 'SET_BACK_TRANSLATE_SUNDAY', payload: false });
		dispatch({ type: 'RESET_RETURN_SCHEDULE' });
	}

	const handleSubmit = async (event) => {
		// VALIDACIONES DE HORARIO
		event.preventDefault();
		dispatch({ type: 'LOADING', payload: true });
		console.log(transportData.startSchedules);
		console.log(transportData.returnSchedules);
		const isValid = days.every(day => {
			const originTime = Number(transportData.startSchedules[day]?.slice(0,2));
			const destinyTime = Number(transportData.returnSchedules[day]?.slice(0,2));
			if(!originTime || !destinyTime) return true;
			if (destinyTime > originTime) {
				return true;
			} else {
				return false;
			}
		});
		if(!isValid) return swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
		try {
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
				<div className='centeredElements'>
				<h5 className='scheduleForm__container--title'>Horario</h5>
				<label htmlFor='scheduleReturn'>Ida y vuelta:</label> {' '}
				<input
					type='checkbox'
					onChange={transportActions.setHasReturn}
					onClick={resetReturnDays}
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
					<DaysSliderReturn
						title='Regreso a origen'
						values={transportData.returnSchedules}
						handleChange={transportActions.setReturnSchedule}
					/>
				)}
			</div>
			<div className='scheduleForm__container'>
				<div className='scheduleForm__container--observations'> 
					<h5>Observaciones</h5>
					<textarea
					rows='10'
						type='text'
						placeholder='Escribe tus comentarios aquí...'
						name='notes'
						id='notes'
						value={transportData.notes}
						onChange={transportActions.setNotes}
					/>
				</div>
			</div>
			<div className='centeredElements'>
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