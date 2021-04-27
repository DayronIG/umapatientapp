import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NODE_SERVER } from '../../config/endpoints';
import { MdModeEdit } from 'react-icons/md';
import { EditRisk } from './MyBackground/Edit/EditRisk';
import { EditAllergies } from './MyBackground/Edit/EditAllergies';
import { EditOperations, EditFractures } from './MyBackground/Edit/EditOperationsTraumatism';
import { EditAnotherConditions } from './MyBackground/Edit/EditAnotherConditions';
import { EditFamilyAntecedents } from './MyBackground/Edit/EditFamilyAntecedents';
import axios from 'axios';
import '../../styles/profile/edit.scss';

export const EditButton = ({ section, clase }) => {
	const dispatch = useDispatch()
	return (
		<button className={`btn-edit ${clase}`}>
			<MdModeEdit
				onClick={() => {
					dispatch({ type: 'EDIT_SECTION', payload: section });
					if(section === 'personal' || section === 'pic') {
						dispatch({ type: 'TOGGLE_DETAIL' });
					}else {
						dispatch({type: 'TOGGLE_MODAL_ACTION', payload: true})
					}
				}}
			/>
		</button>
	);
};

export const EditAntecedents = () => {
	const dispatch = useDispatch()
	const { section } = useSelector((state) => state.front);
	const { currentUser } = useSelector(state => state.userActive)
	const userHistory = useSelector((state) => state.userHistory)
	
	const updateData = async() => {
		let data = {
			history: {
				...userHistory
			}
		};
		localStorage.setItem('userHistory', JSON.stringify(userHistory));
		await currentUser.getIdToken().then(async token => {
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
			await axios.post(`${NODE_SERVER}/history/self/${currentUser.uid}`, data, {headers})
				.then((res)=> {
					dispatch({type: 'TOGGLE_MODAL_ACTION', payload: false})
					dispatch({type: 'USER_HISTORY_EDIT', payload: false})
				})
				.catch((err) => {
					console.error(err);
				});
			});
	}
	
	switch (section) {
		case 'riskFactor':
			return <EditRisk updateData={()=> updateData()}/>;
		case 'allergies':
			return <EditAllergies updateData={()=> updateData()}/>;
		case 'operations':
			return <EditOperations updateData={()=> updateData()}/>;
		case 'fractures':
			return <EditFractures updateData={()=> updateData()}/>;
		case 'anotherConditions':
			return <EditAnotherConditions updateData={()=> updateData()}/>;
		case 'familyAntecedents':
			return <EditFamilyAntecedents updateData={()=> updateData()}/>
		default:
			return 'Esta sección aún no se encuentra disponible';
	}
}
