import React from 'react';
import { BsPlusCircleFill } from 'react-icons/bs'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const CreateNewService = () => {
	const history = useHistory();
	const user = useSelector(state => state.user);

	return (
		<div className="createNewService__container" onClick={() => history.push(`/${user.ws}/createTransportRoute`)}>
			<div className="createNewService__icon">
				<BsPlusCircleFill />
			</div>
		</div>
	);
}

export default CreateNewService;