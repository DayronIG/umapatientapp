import React, { useState } from 'react'
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
	const [limiter, setLimiter] = useState(1);
	return (
		<div className='daysSlider'>
			<h5 className='daysSlider__title'>{title}</h5>
			<div className='daysSlider__slider'>
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
			</div>
		</div>
	);
}
