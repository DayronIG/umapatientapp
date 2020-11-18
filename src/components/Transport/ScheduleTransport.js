import React, { useState, useEffect } from 'react';
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

	useEffect(() =>{
		window.gtag('event', 'select_content', {content_type: "SCHEDULE_TRANSPORT", item: ['SCHEDULE_TRANSPORT']})
	},[])

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

	const resetOriginDays = () => {
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_MONDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_TUESDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_WEDNESDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_THURSDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_FRIDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_SATURDAY', payload: false });
		dispatch({ type: 'SET_ORIGIN_TRANSLATE_SUNDAY', payload: false });
		dispatch({ type: 'RESET_START_SCHEDULE' });
	}

	const handleSubmit = async (event) => {
		try {
			event.preventDefault();
			dispatch({ type: 'LOADING', payload: true });
			function isEmpty(obj) {
				for(var key in obj) {
					if(obj.hasOwnProperty(key))
						return false;
				}
				return true;
			}
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
			console.log('isvalid');
			if(!isValid){
				swal('Error', 'El horario de ida debe ser anterior al de vuelta.', 'warning')
				dispatch({ type: 'LOADING', payload: false });
				return false
			} 
			console.log('checks 1');

			if(isEmpty(transportData.startSchedules)){
				swal('Error', 'El horario de llegada a destino no puede estar vacio. Ingrese al menos 1.', 'warning');
				dispatch({ type: 'LOADING', payload: false });
				return false
			}
			console.log('checks 2');

			await transportActions.createTransportSchedule(transportData, patient);
			

			console.log('checks 3');

			await swal('Éxito', 'Traslado creado con éxito', 'success');
			window.gtag('event', 'select_content', {content_type: "NEW_TRANSPORT_CREATED", item: ['NEW_TRANSPORT_CREATED']})
			dispatch({ type: 'LOADING', payload: false });
			
			console.log('checks 4');

			history.push(`/${ws}/scheduledTransportSuccess`);
			return true
		} catch (error) {
			console.error(error);
			dispatch({ type: 'LOADING', payload: false });
			window.gtag('event', 'select_content', {content_type: "NEW_TRANSPORT_FAIL", item: ['NEW_TRANSPORT_FAIL']})
			swal('Error', 'Hubo un error al crear su traslado. Por favor, intente de nuevo', 'warning');
			return false
		}
	}

	return (
		<form className='scheduleForm'>
			{loading && <Loading />}
			<div className='scheduleForm__container'>
				<h5>Duración del traslado</h5>
				<div className='scheduleForm__container--input'>
					<label className="label">Fecha de inicio</label>
					<input
					className="dateInput"
						required
						min={today}
						type='date'
						value={transportData.start_date}
						onChange={transportActions.setStartDate}
					/>
				</div>
				<div className='scheduleForm__container--input'>
					<label className="label">Fecha de finalizacion</label>
					<input
					className="dateInput"
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
					<h5 className='scheduleForm__container--title'>Horario de llegada a destino</h5>
					<DaysSlider
						values={transportData.startSchedules}
						handleChange={transportActions.setStartSchedule}
					/>
					</div>
				</div>
				<div className="scheduleForm__container">
				<div className='centeredElements'>
				<h5 className='scheduleForm__container--title'>Horario de salida</h5>
				{!transportData.hasReturn && (
						<button 
							className="addButton"
							type="button"
							onClick={() => transportActions.setHasReturn(false)}
						>
							+ Agregar horarios
						</button>
					)
				}
				{transportData.hasReturn && (
					<>
						<DaysSliderReturn
							values={transportData.returnSchedules}
							handleChange={transportActions.setReturnSchedule}
						/>
						<button 
							className="addButton closeDays"
							type="button"
							onClick={function() {
								transportActions.setHasReturn(true)
								resetReturnDays()
							}}
						>
							- Borrar horarios
						</button>
					</>
				)}
				</div>
				</div>
			<div className='scheduleForm__container'>
				<div className='scheduleForm__container--observations'> 
					<h5 className="scheduleForm__observationsTitle">Observaciones</h5>
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
			<div className="FooterBtn">
				<button onClick={handleSubmit}>Crear traslado</button>
			</div>
		</form>
	);
}

export default ScheduleTransport;