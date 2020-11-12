import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import moment from 'moment-timezone';
import axios from 'axios';
import { transport_feedback } from '../../config/endpoints';

const TransportRating = (props) => {
	const [ratingApp, setRatingApp] = useState(0);
	const [ratingTransport, setRatingTransport] = useState(0);
	const [notes, setNotes] = useState('');
	const token = useSelector((state) => state.userActive.token);
	const patient = useSelector((state) => state.queries.patient);
	const { assignation_id, ws } = useParams();
	const history = useHistory();
	
	async function submitRating() {
		let headers = { 'Content-Type': 'Application/Json', 'Authorization': token };
		try {
				let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss');
				let data = {
					ws,
					assignation_id,
					dni: patient.dni,
					corporate: patient.corporate_norm,
					dt: date,
					uma_eval: ratingApp.toString(),
					transport_eval: ratingTransport.toString(),
					notes: notes.replace(/(\r\n|\n|\r)/gm, "").trim()
				}
				await axios.post(transport_feedback, data, headers);
				history.push('/');
		} catch (err) {
				console.error(err);
				history.push('/');
		}
	}

	return (
		<div className="ratings-container text-center p5">
			<label>¿Cómo evaluaría la aplicación?</label>
				<StarRatings
						rating={ratingApp}
						changeRating={setRatingApp}
						numberOfStars={5}
						name='rating'
						starDimension="40px"
						starRatedColor="#42A5F6"
						starHoverColor="#0071F2"
				/>
				<label>¿Cómo evaluaría el transporte?</label>
				<StarRatings
						rating={ratingTransport}
						changeRating={setRatingTransport}
						numberOfStars={5}
						name='rating'
						starDimension="40px"
						starRatedColor="#42A5F6"
						starHoverColor="#0071F2"
				/>
				<textarea placeholder="Comentarios" onChange={(e) => setNotes(e.target.value)}></textarea>
				<button className="btn btn-blue-lg mt-5" onClick={submitRating}>Enviar</button>
		</div>
	);
}

export default TransportRating;
