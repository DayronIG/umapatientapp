import React, { useState, useEffect, useRef } from 'react';
import '../../styles/generalcomponents/timePicker.scss';

export default function ({ onChange, value }) {
	const [hour, setHour] = useState('');
	const [minutes, setMinutes] = useState('');
	const minutesRef = useRef();
	const reg = /^\d+$/;

	useEffect(() => {
		if (typeof value === 'string') {
			setHour(value.slice(0, 2));
			setMinutes(value.slice(3, 5));
		}
	}, [value]);

	function checkhour(time) {
		try {
			let helper = time;
			const parsedTime = parseInt(time);
			const isNumber = reg.exec(time);
			if (time === '' || (parsedTime >= 0 && parsedTime < 24 && isNumber)) {
				if (time.length > 2) {
					helper = helper.substring(0, time.length - 1)
					const combineTime = `${helper}:${minutes}`;
					onChange(combineTime);
				} else if (time.length === 1 || time.length === 0) {
					const combineTime = `${helper}`;
					onChange(combineTime);
				} else {
					const combineTime = `${helper}:${minutes}`;
					minutesRef.current.focus();
					onChange(combineTime);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	function checkminutes(time) {
		try {
			let helper = time;
			const parsedTime = parseInt(time);
			const isNumber = reg.exec(time);
			if (hour.length === 2) {
				if (time === "" || (parsedTime >= 0 && parsedTime < 60 && isNumber)) {
					if (time.length > 2) {
						helper = helper.substring(0, time.length - 1);
						const combineTime = `${hour}:${helper}`;
						onChange(combineTime);
					} else if (time.length === 1 || time.length === 0) {
						const combineTime = `${hour}:${helper}`;
						onChange(combineTime);
					} else {
						const combineTime = `${hour}:${helper}`;
						onChange(combineTime);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="timepicker">
			<input
				type="text"
				onChange={function (event) {
					checkhour(event.target.value)
				}}
				placeholder='Hora'
				value={hour}
				className="timepicker__input"
				required
			/>
			<span className='timepicker__separator'>:</span>
			<input
				type="text"
				onChange={function (event) {
					checkminutes(event.target.value)
				}}
				ref={minutesRef}
				placeholder='Min'
				value={minutes}
				className="timepicker__input"
				required
			/>
		</div>
	);
}
