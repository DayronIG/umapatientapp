import React from 'react';
import Draw from '../../assets/draw.svg'
import { useSelector } from 'react-redux';
import { FaChevronLeft } from 'react-icons/fa'
import { useHistory } from "react-router";
import '../../styles/generalcomponents/TransportNoDriver.scss';

function TransportNoDriver() {
	const { patient } = useSelector(state => state.queries)
	const history = useHistory();
	return (
		<>
			<FaChevronLeft
				className="leftArrow"
				onClick={() => history.push(`/${patient.ws}/transportUserActive`)} 
			/>
			<div className="noDriverContainer">
					<img src={Draw}></img>
					<h2>Aún no tiene asignado un conductor</h2>
					<p>Acá podrás seguir el recorrido de tu traslado cuando se te asigne un conductor.</p>
			</div>
		</>
	);
}


export default TransportNoDriver