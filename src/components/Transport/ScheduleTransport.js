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
import { transport } from '../../config/endpoints';

function ScheduleTransport() {
	const { loading } = useSelector(state => state.front)
	const transportData = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const { ws } = useParams();
	const [today] = useState(moment().format('YYYY-MM-DD'));
	const [tomorrow] = useState(moment().add(1, 'day').format('YYYY-MM-DD'));
	const dispatch = useDispatch();
	const history = useHistory();

	// console.log(Number(transportData.startSchedules.mon.slice(0,2)))
	console.log(transportData)

	const resetReturnDays = () => {
		dispatch({ type: 'SET_BACK_TRANSLATE_MONDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_TUESDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_WEDNESDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_THURSDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_FRIDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_SATURDAY', payload: false })
		dispatch({ type: 'SET_BACK_TRANSLATE_SUNDAY', payload: false })
		
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'mon', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'tue', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'wed', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'thu', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'fri', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'sat', value: ''}})
		dispatch({type: 'HANDLE_RETURN_SCHEDULE', payload: {key: 'sun', value: ''}})
		

	}

	const handleSubmit = async (event) => {
		// VALIDACIONES DE HORARIO
		
		
		event.preventDefault();
		if (transportData.startSchedules.mon !== undefined && transportData.returnSchedules.mon !== undefined) {

		const mondayOrigin = Number(transportData.startSchedules.mon.slice(0,2))
		const mondayDestiny = Number(transportData.returnSchedules.mon.slice(0,2))

		if (mondayOrigin > mondayDestiny){
			console.log(mondayOrigin)
			console.log(mondayDestiny)
			alert('El horario de ida debe ser anterior al de vuelta.')
			
			return
		}
			}

		if (transportData.startSchedules.tue !== undefined && transportData.returnSchedules.tue !== undefined){

			const tuesdayOrigin = Number(transportData.startSchedules.tue.slice(0,2))
		const tuesdayDestiny = Number(transportData.returnSchedules.tue.slice(0,2))

			if (tuesdayOrigin > tuesdayDestiny){
				swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
				return
			}

		}
		
		if (transportData.startSchedules.wed !== undefined && transportData.returnSchedules.wed !== undefined){

		

		const wednesdayOrigin = Number(transportData.startSchedules.wed.slice(0,2))
		const wednesdayDestiny = Number(transportData.returnSchedules.wed.slice(0,2))

		if (wednesdayOrigin > wednesdayDestiny){
			swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
			return
		}
		}

		if (transportData.startSchedules.thu !== undefined && transportData.returnSchedules.thu !== undefined){

		

		const thursdayOrigin = Number(transportData.startSchedules.thu.slice(0,2))
		const thursdayDestiny = Number(transportData.returnSchedules.thu.slice(0,2))

		if (thursdayOrigin > thursdayDestiny){
			swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
			return
		}
	}

	if (transportData.startSchedules.fri !== undefined && transportData.returnSchedules.fri !== undefined){

		const fridayOrigin = Number(transportData.startSchedules.fri.slice(0,2))
		const fridayDestiny = Number(transportData.returnSchedules.fri.slice(0,2))

		if (fridayOrigin > fridayDestiny){
			swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
			return
		}
	}

	if (transportData.startSchedules.sat !== undefined && transportData.returnSchedules.sat !== undefined){

		const saturdayOrigin = Number(transportData.startSchedules.sat.slice(0,2))
		const saturdayDestiny = Number(transportData.returnSchedules.sat.slice(0,2))

		if (saturdayOrigin > saturdayDestiny){
			swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
			return
		}
	}

	if (transportData.startSchedules.sun !== undefined && transportData.returnSchedules.sun !== undefined){

		const sundayOrigin = Number(transportData.startSchedules.sun.slice(0,2))
		const sundayDestiny = Number(transportData.returnSchedules.sun.slice(0,2))

		if (sundayOrigin > sundayDestiny){
			swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning');
			return
		}
	}



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
				<div className="scheduleForm__observations"> 
					<h5>Observaciones</h5>
					<textarea
					rows="10"
						type='text'
						placeholder='Escribe tus comentarios aquí...'
						name='notes'
						id='notes'
						value={transportData.notes}
						onChange={transportActions.setNotes}
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