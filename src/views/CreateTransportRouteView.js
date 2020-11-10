import React from 'react';
import CreateTransportRouteOrigin from '../components/Transport/CreateTransportRouteOrigin';
import CreateTransportRouteDestiny from '../components/Transport/CreateTransportRouteDestiny';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import { useSelector } from 'react-redux';

function CreateTransportRouteView() {
	const { pointSelector } = useSelector(state => state.transport);
	return (
		<section>
			<GenericHeader>Seleccionar Ruta</GenericHeader>
			{pointSelector === 'origin' ?
				<CreateTransportRouteOrigin />
				:
				<CreateTransportRouteDestiny />
			}
		</section>
	);
}


export default CreateTransportRouteView;
