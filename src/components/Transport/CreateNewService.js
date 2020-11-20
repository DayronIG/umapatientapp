import React, { useState, useRef } from 'react';
import { TiPlus } from 'react-icons/ti';
import { BsCalendar } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	DatePicker,
} from '@material-ui/pickers';
import 'date-fns'


const CreateNewService = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { patient } = useSelector(state => state.queries);
	const { date_filter } = useSelector(state => state.transport);
	const [datePickerOpen, setDatePickerOpen] = useState(false)

	const handlerPickerDate = (date) => {
		setDatePickerOpen(!datePickerOpen)
	}
	return (
		<div className="createNewService__container">
			<div className="createNewService__icon " onClick={() => history.push(`/${patient.ws}/createTransportRoute`)} >
				<TiPlus />
			</div>
			<div className="createNewService__icon calendar" onClick={handlerPickerDate}>
				<BsCalendar />
			</div>
			<MuiPickersUtilsProvider utils={DateFnsUtils} >
				<DatePicker
					value={date_filter || new Date()}
					onChange={(e) => dispatch({ type: 'SET_DATE_FILTER', payload: e })}
					onClose={handlerPickerDate}
					open={datePickerOpen}
				/>
			</MuiPickersUtilsProvider>
		</div>
	);
}

export default CreateNewService;