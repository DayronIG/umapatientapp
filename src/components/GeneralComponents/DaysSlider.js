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
	values,
	handleChange
}) {
	
	const transportData = useSelector(state => state.transport);
	const dispatch = useDispatch();

	const handlerInputChange = (e) => {
		const { name, value } = e.target
		handleChange(value, name)
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
								<Cleave placeholder="00:00" name="mon" value={values.mon} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />

								<span>Hs.</span>
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_ORIGIN_TRANSLATE_MONDAY', payload: !transportData.origin_translate_monday })
								if (transportData.origin_translate_monday) {
									dispatch({ type: 'HANDLE_START_SCHEDULE', payload: { key: 'mon', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.origin_translate_monday ? "✓" : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Martes</span>
					{transportData.origin_translate_tuesday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="tue" value={values.tue} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />

								<span>Hs.</span>
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_ORIGIN_TRANSLATE_TUESDAY', payload: !transportData.origin_translate_tuesday })
								if (transportData.origin_translate_tuesday) {
									dispatch({ type: 'HANDLE_START_SCHEDULE', payload: { key: 'tue', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.origin_translate_tuesday ? "✓" : null}</span>
					</label>
				</div>


				<div className="switcher">
					<span>Miercoles</span>
					{transportData.origin_translate_wednesday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="wed" value={values.wed} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />

								<span>Hs.</span>
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_ORIGIN_TRANSLATE_WEDNESDAY', payload: !transportData.origin_translate_wednesday })
								if (transportData.origin_translate_wednesday) {
									dispatch({ type: 'HANDLE_START_SCHEDULE', payload: { key: 'wed', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.origin_translate_wednesday ? "✓" : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Jueves</span>
					{transportData.origin_translate_thursday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="thu" value={values.thu} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />

								<span>Hs.</span>
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_ORIGIN_TRANSLATE_THURSDAY', payload: !transportData.origin_translate_thursday })
								if (transportData.origin_translate_thursday) {
									dispatch({ type: 'HANDLE_START_SCHEDULE', payload: { key: 'thu', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.origin_translate_thursday ? "✓" : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Viernes</span>
					{transportData.origin_translate_friday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="fri" value={values.fri} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />

								<span>Hs.</span>
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_ORIGIN_TRANSLATE_FRIDAY', payload: !transportData.origin_translate_friday })
								if (transportData.origin_translate_friday) {
									dispatch({ type: 'HANDLE_START_SCHEDULE', payload: { key: 'fri', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.origin_translate_friday ? "✓" : null}</span>
					</label>
				</div>
			</div>
		</div>
	);
}
