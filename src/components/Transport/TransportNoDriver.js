import React, { useEffect } from 'react';
import Draw from '../../assets/draw.svg'
import { useSelector } from 'react-redux';
import { FaChevronLeft } from 'react-icons/fa'
import { useHistory } from "react-router";
import '../../styles/generalcomponents/TransportNoDriver.scss';

function TransportNoDriver() {
	const user = useSelector(state => state.user);
	const history = useHistory();
	useEffect(() => {
		window.gtag('event', 'select_content', { content_type: "TRANSPORT_NO_DRIVER", item: ['TRANSPORT_NO_DRIVER'] })
	}, [])
	return (
		<>
			<FaChevronLeft
				className="leftArrow"
				onClick={() => history.push(`/${user.ws}/transportUserActive`)}
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