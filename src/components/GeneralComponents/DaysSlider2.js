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

	const [hours, sethours] = useState({mondayBack: '', tuesdayBack: '', wednesdayBack: '', thursdayBack: '', fridayBack: ''})
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
							{transportData.back_translate_monday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="mondayBack" value={hours.mondayBack} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_BACK_TRANSLATE_MONDAY', payload: !transportData.back_translate_monday })
									if (transportData.back_translate_monday) { sethours({...hours, mondayBack: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.back_translate_monday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Martes</span>
							{transportData.back_translate_tuesday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="tuesdayBack" value={hours.tuesdayBack} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_BACK_TRANSLATE_TUESDAY', payload: !transportData.back_translate_tuesday })
									if (transportData.back_translate_tuesday) { sethours({...hours, tuesdayBack: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.back_translate_tuesday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Miercoles</span>
							{transportData.back_translate_wednesday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="wednesdayBack" value={hours.wednesdayBack} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_BACK_TRANSLATE_WEDNESDAY', payload: !transportData.back_translate_wednesday })
									if (transportData.back_translate_wednesday) { sethours({...hours, wednesdayBack: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.back_translate_wednesday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Jueves</span>
							{transportData.back_translate_thursday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="thursdayBack" value={hours.thursdayBack} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_BACK_TRANSLATE_THURSDAY', payload: !transportData.back_translate_thursday })
									if (transportData.back_translate_thursday) { sethours({...hours, thursdayBack: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.back_translate_thursday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Viernes</span>
							{transportData.back_translate_friday ? 
							<div className="inputers"> 
								<div> 
									<Cleave placeholder="00:00" name="fridayBack" value={hours.fridayBack} onChange = {handlerInputChange} className="CleaveInput" options={{time: true, timePattern: ['h', 'm']}} />
									
									<span>Hs.</span> 
								</div> 
							</div> : null }
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() =>{
									dispatch({ type: 'SET_BACK_TRANSLATE_FRIDAY', payload: !transportData.back_translate_friday })
									if (transportData.back_translate_friday) { sethours({...hours, fridayBack: ''})}
									
								}
									
								} 
								/> 
								<span class="slider round">{transportData.back_translate_friday ? "✓" : null}</span>
								</label>
						</div>

					</div>
		</div>
	);
}