import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDay } from '../Utils/stringUtils';
import { days } from '../Utils/transportUtils';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import TimePicker from '../GeneralComponents/TimePicker';
import '../../styles/generalcomponents/daysSlider.scss'
import Cleave from 'cleave.js/react';

export default function DaysSlider({
	title = '',
	handleChange = () => { },
	values = {}
}) {
	
	// const [limiter, setLimiter] = useState(1);

	const [hours, sethours] = useState({monday: '', tuesday: '', wednesday: '', thursday: '', friday: ''})
	const transportData = useSelector(state => state.front);
	const dispatch = useDispatch();

	const handlerInputChange = (e) => {
		const {name, value} = e.target
		sethours({...hours, [name]: value})

		
	}
	const handlerInputClear = () => {
		sethours({monday: ''})
	}
	
		console.log(hours)
	
	

	return (
		<div className='daysSlider'>
			<p>{hours.mondayMinutes}</p>
			<h5 className='daysSlider__title'>{title}</h5>
					<div className="modal-body">
						<div className="switcher">
							<span>Lunes</span>
							{transportData.origin_translate_monday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="monday" value={hours.monday} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : console.log(hours) }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_ORIGIN_TRANSLATE_MONDAY', payload: !transportData.origin_translate_monday })
									if (transportData.origin_translate_monday) { sethours({...hours, monday: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.origin_translate_monday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Martes</span>
							{transportData.origin_translate_tuesday ? 
							<div className="inputers"> 
							<div> 
							<Cleave placeholder="00:00" name="tuesday" value={hours.tuesday} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_ORIGIN_TRANSLATE_TUESDAY', payload: !transportData.origin_translate_tuesday })
									if (transportData.origin_translate_tuesday) { sethours({...hours, tuesday: ''})}}} 
								/> 
								<span class="slider round">{transportData.origin_translate_tuesday ? "✓" : null}</span>
								</label>
						</div>
						

						<div className="switcher">
							<span>Miercoles</span>
							{transportData.origin_translate_wednesday ? 
							<div className="inputers"> 
							<div> 
							<Cleave placeholder="00:00" name="wednesday" value={hours.wednesday} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_ORIGIN_TRANSLATE_WEDNESDAY', payload: !transportData.origin_translate_wednesday })
									if (transportData.origin_translate_wednesday) { sethours({...hours, wednesday: ''})}}} 
								/> 
								<span class="slider round">{transportData.origin_translate_wednesday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Jueves</span>
							{transportData.origin_translate_thursday ? 
							<div className="inputers"> 
							<div> 
							<Cleave placeholder="00:00" name="thursday" value={hours.thursday} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_ORIGIN_TRANSLATE_THURSDAY', payload: !transportData.origin_translate_thursday })
									if (transportData.origin_translate_thursday) { sethours({...hours, thursday: ''})}}} 
								/> 
								<span class="slider round">{transportData.origin_translate_thursday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Viernes</span>
							{transportData.origin_translate_friday ? 
							<div className="inputers"> 
							<div> 
							<Cleave placeholder="00:00" name="friday" value={hours.friday} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_ORIGIN_TRANSLATE_FRIDAY', payload: !transportData.origin_translate_friday })
									if (transportData.origin_translate_friday) { sethours({...hours, friday: ''})}}} 
								/> 
								<span class="slider round">{transportData.origin_translate_friday ? "✓" : null}</span>
								</label>
						</div>

						

							
					</div>
					
					
					

			{/* <div className='daysSlider__slider'>
				{days
					.filter((day, index) => index < limiter)
					.map((day, index) => (
						<div key={day}>
							<label>{getDay(index)}</label>
							<TimePicker
								value={values[day]}
								onChange={(value) => handleChange(value, day)}
							/>
						</div>
					))}
				{limiter < 7 &&
					<div className='plusIcon' onClick={() => setLimiter(limiter + 1)}>
						<AiOutlinePlusCircle />
					</div>}
				{limiter > 1 &&
					<div className='plusIcon' onClick={() => setLimiter(limiter - 1)}>
						<AiOutlineMinusCircle />
					</div>}
			</div> */}
		</div>
	);
}
