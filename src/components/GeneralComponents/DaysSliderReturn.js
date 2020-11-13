import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDay } from '../Utils/stringUtils';
import { days } from '../Utils/transportUtils';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import TimePicker from '../GeneralComponents/TimePicker';
import '../../styles/generalcomponents/daysSlider.scss'
import Cleave from 'cleave.js/react';
import { FaCheck } from 'react-icons/fa';

export default function DaysSliderReturn({
	values,
	handleChange
}) {
	// const [hours, sethours] = useState({monday: '', tuesday: '', wednesday: '', thursday: '', friday: ''})
	const transportData = useSelector(state => state.transport);
	const dispatch = useDispatch();

	const handlerInputChange = (e) => {
		const { name, value } = e.target
		handleChange(value, name)
	}
	


	return (
		<div className='daysSlider'>
			<div className="modal-body">
				<div className="switcher">
					<span>Lunes</span>
					{transportData.back_translate_monday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="mon" value={values.mon} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_MONDAY', payload: !transportData.back_translate_monday })
								if (transportData.back_translate_monday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'mon', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_monday ? <FaCheck /> : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Martes</span>
					{transportData.back_translate_tuesday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="tue" value={values.tue} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_TUESDAY', payload: !transportData.back_translate_tuesday })
								if (transportData.back_translate_tuesday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'tue', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_tuesday ? <FaCheck /> : null}</span>
					</label>
				</div>


				<div className="switcher">
					<span>Miercoles</span>
					{transportData.back_translate_wednesday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="wed" value={values.wed} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_WEDNESDAY', payload: !transportData.back_translate_wednesday })
								if (transportData.back_translate_wednesday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'wed', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_wednesday ? <FaCheck /> : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Jueves</span>
					{transportData.back_translate_thursday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="thu" value={values.thu} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_THURSDAY', payload: !transportData.back_translate_thursday })
								if (transportData.back_translate_thursday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'thu', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_thursday ? <FaCheck /> : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Viernes</span>
					{transportData.back_translate_friday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="fri" value={values.fri} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_FRIDAY', payload: !transportData.back_translate_friday })
								if (transportData.back_translate_friday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'fri', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_friday ? <FaCheck /> : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Sabado</span>
					{transportData.back_translate_saturday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="sat" value={values.sat} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_SATURDAY', payload: !transportData.back_translate_saturday })
								if (transportData.back_translate_saturday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'sat', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_saturday ? <FaCheck /> : null}</span>
					</label>
				</div>

				<div className="switcher">
					<span>Domingo</span>
					{transportData.back_translate_sunday ?
						<div className="inputers">
							<div>
								<Cleave placeholder="00:00" name="sun" value={values.sun} onChange={handlerInputChange} className="CleaveInput" options={{ time: true, timePattern: ['h', 'm'] }} />
							</div>
						</div> : null}
					<label id="switch" class="switch">
						<input id="input" type="checkbox"
							onClick={() => {
								dispatch({ type: 'SET_BACK_TRANSLATE_SUNDAY', payload: !transportData.back_translate_sunday })
								if (transportData.back_translate_sunday) {
									dispatch({ type: 'HANDLE_RETURN_SCHEDULE', payload: { key: 'sun', value: '' } })
								}
							}}
						/>
						<span class="slider round">{transportData.back_translate_sunday ? <FaCheck /> : null}</span>
					</label>
				</div>
			</div>
		</div>
	);
}
