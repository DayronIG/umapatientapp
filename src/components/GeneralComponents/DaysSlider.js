import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDay } from '../Utils/stringUtils';
import { days } from '../Utils/transportUtils';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import TimePicker from '../GeneralComponents/TimePicker';
import '../../styles/generalcomponents/daysSlider.scss'

export default function DaysSlider({
	title = '',
	handleChange = () => { },
	values = {}
}) {
	
	// const [limiter, setLimiter] = useState(1);
	
	const initialState= {lunes: '', martes: ''}
	const [hours, sethours] = useState(initialState)
	const transportData = useSelector(state => state.front);
	const dispatch = useDispatch();
	const handlerInputChange = (e) => {
		const {name, value} = e.target
		sethours({...hours, [name]: value})
	}	
	return (
		<div className='daysSlider'>
			
			<h5 className='daysSlider__title'>{title}</h5>
			
					
					<div className="modal-body">
						<div className="switcher">
							<span>Lunes</span>
							{transportData.origin_translate_monday ? 
							<div className="inputers"> 
							<div> 
								<input type="number" maxLength="2" name='lunes' value={hours.lunes} onChange = {handlerInputChange} className="timeInput" placeholder="00"/> 
								<span>:</span> 
								<input className="timeInput" placeholder="00"/> 
							</div> 
							</div> : <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_MONDAY', payload: !transportData.origin_translate_monday })} 
								/>
								<span class="slider round">{transportData.origin_translate_monday ? "✓" : null}</span>
								</label>
						</div>


						<div className="switcher">
							<span>Martes</span>
							{transportData.origin_translate_tuesday ? <div className="inputers"><div> <input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div></div> : <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_TUESDAY', payload: !transportData.origin_translate_tuesday })} 
								/>
								<span class="slider round">{transportData.origin_translate_thursday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Miercoles</span>
							{transportData.origin_translate_wednesday ? <div className="inputers"><div> <input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div></div>: <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_WEDNESDAY', payload: !transportData.origin_translate_wednesday })} 
								/>
								<span class="slider round">{transportData.origin_translate_wednesday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Jueves</span>
							{transportData.origin_translate_thursday ? <div className="inputers"><div> <input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div></div> : <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_THURSDAY', payload: !transportData.origin_translate_thursday })} 
								/>
								<span class="slider round">{transportData.origin_translate_thursday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Viernes</span>
							{transportData.origin_translate_friday ? <div className="inputers"> <div><input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div> </div>: <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_FRIDAY', payload: !transportData.origin_translate_friday })} 
								/>
								<span class="slider round">{transportData.origin_translate_friday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Sábado</span>
							{transportData.origin_translate_saturday ? <div className="inputers"><div> <input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div></div> : <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_SATURDAY', payload: !transportData.origin_translate_saturday })} 
								/>
								<span class="slider round">{transportData.origin_translate_saturday ? "✓" : null}</span>
								</label>
						</div>

						<div className="switcher">
							<span>Domingo</span>
							{transportData.origin_translate_sunday ? <div className="inputers"><div> <input className="timeInput" placeholder="00"/> <span>:</span> <input className="timeInput" placeholder="00"/> </div></div>: <div className="inputers"></div>}
								<label id="switch" class="switch">
								<input id="input" type="checkbox"
								onClick={() => dispatch({ type: 'SET_ORIGIN_TRANSLATE_SUNDAY', payload: !transportData.origin_translate_sunday })} 
								/>
								<span class="slider round">{transportData.origin_translate_sunday ? "✓" : null}</span>
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