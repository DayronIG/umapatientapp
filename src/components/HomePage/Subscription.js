import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { getBills } from "../../store/actions/firebaseQueries";
import '../../styles/home/subscription.scss';

const Subscription = (props) => {
	const patient = useSelector(state => state.queries.patient);

	return (
		<section className="subscription-container">
			<div className="subscription-module">
				<div className="subscription-plan">
					<b>Suscripción</b>
					<span>{(patient.subscription?.toUpperCase()) || "-"}</span>
				</div>
				<div className="subscription-expire">
					<b>Finalización</b>
					<span> - {/* bills && bills.vcto || "-" */}</span>
				</div>
				<div className="subscription-points">
					<b>Puntos</b>
					<span>{patient.points || "0"}</span>
				</div>
			</div>
		</section>
	)
}

export default withRouter(Subscription);