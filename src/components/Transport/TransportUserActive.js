import React from 'react';
import DisplayTrips from './DisplayTrips';
import { GenericHeader } from '../GeneralComponents/Headers'
import CreateNewService from './CreateNewService';
import '../../styles/generalcomponents/TransportUserActive.scss';

const TransportUserActive = () => (
	<div className="wrapperUserActive">
		<GenericHeader />
		<div className="transportUserActive">
			<DisplayTrips />
			<CreateNewService />
		</div>
	</div>
);

export default TransportUserActive;
