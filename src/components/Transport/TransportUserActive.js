import React from 'react';
import DisplayTrips from './DisplayTrips';
import { GenericHeader } from '../GeneralComponents/Headers'
import CreateNewService from './CreateNewService';
import '../../styles/generalcomponents/TransportUserActive.scss';

const TransportUserActive = () => {
	return (
		<>
			<GenericHeader />
			<div className="wrapperUserActive">
				<div className="transportUserActive">
					<DisplayTrips />
					<CreateNewService />
				</div>
			</div>
		</>
	)
}

export default TransportUserActive;
