import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import moment from 'moment-timezone';
import swal from 'sweetalert';
import axios from 'axios';
import queryString from 'query-string';
import { feedback } from '../../../config/endpoints';
import { getMedicalRecord } from '../../../store/actions/firebaseQueries';

const Rating = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [ratingApp, setRatingApp] = useState(0);
	const [ratingMed, setRatingMed] = useState(0);
	const [notes, setNotes] = useState('');
	const token = useSelector((state) => state.userActive.token);
	const mr = useSelector((state) => state.queries.medicalRecord);
	const user = useSelector((state) => state.user)
    const uid = useSelector(state => state.userActive?.currentUser?.uid)
	const location = useLocation()
    const { dependant, activeUid, assignation_id } = queryString.parse(location.search)

    React.useEffect(() => {
        let local = JSON.parse(localStorage.getItem('appointmentUserData'))
        try {
			let dependant = activeUid === uid ? false : true
			console.log(dependant)
            dispatch(getMedicalRecord(activeUid, dependant))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch, activeUid])

	useEffect(() => {
		if (
			mr[0] &&
			(mr[0].mr_preds?.temperatura >= 1 ||
				mr[0].mr_preds?.traslado >= 1 ||
				mr[0].mr.destino_final === 'Paciente Ausente' ||
				mr[0].mr.destino_final === 'Anula Paciente' ||
				mr[0].mr.destino_final === 'Anula por falla de conexión')
		) {
			dispatch({ type: 'RESET_ALL' });
			history.push('/home');
		} else if (mr[0] && mr[0].mr.destino_final === 'Paciente ausente') {
			dispatch({ type: 'RESET_ALL' });
			swal(
				'El médico cerró tu atención.',
				'Motivo: Paciente ausente. Puede realizar una nueva consulta.',
				'warning'
			);
			history.push('/home');
		} else if (mr[0] && mr[0].mr.destino_final === 'Anula el paciente') {
			dispatch({ type: 'RESET_ALL' });
			swal(
				'El médico cerró tu atención.',
				'Motivo: Anula el paciente. Puede realizar una nueva consulta.',
				'warning'
			);
			history.push('/home');
		} else if (mr[0] && mr[0].mr.destino_final === 'Anula por falla de conexión') {
			dispatch({ type: 'RESET_ALL' });
			swal(
				'El médico cerró tu atención.',
				'Motivo: Anula por falla de conexión. Puede realizar una nueva consulta.',
				'warning'
			);
			history.push('/home');
		}
	}, [mr]);

    const submitRating = useCallback(
		async () => {
			if(ratingApp === 0 || ratingMed === 0) {
				swal("Debes poner una calificación!", "No te olvides de puntuar al médico y a la aplicación", "warning")
				return ""
			}
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
			try {
				let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
				let u = JSON.parse(localStorage.getItem('appointmentUserData'))
				// let mr = JSON.parse(localStorage.getItem('userMr'))
				// let assignation_id = JSON.parse(localStorage.getItem('currentMr'))
				let data = {
					'ws': u.ws || user.ws,
					'dni': u.dni || user.dni,
					'dt': date,
					'assignation_id': assignation_id,
					'uma_eval': ratingApp.toString(),
					'doc_eval': ratingMed.toString(),
					'notes': notes.replace(/(\r\n|\n|\r)/gm, "").trim(),
					'uid': uid,
					'uid_dependant': dependant === 'true' ? activeUid : false
				}
				await axios.post(feedback, data, headers)
				history.push('/home')
			} catch (err) {
				console.error(err)
				history.push('/home');
			}
		},
		[ratingApp, ratingMed, notes],
	)
       
    

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
					<label>¿Cómo evaluaría al médico?</label>
					<StarRatings
							rating={ratingMed}
							changeRating={setRatingMed}
							numberOfStars={5}
							name='rating'
							starDimension="40px"
							starRatedColor="#42A5F6"
							starHoverColor="#0071F2"
					/>
					<textarea placeholder="Comentarios sobre la atención" onChange={(e) => setNotes(e.target.value)}></textarea>
					<button className="btn btn-blue-lg mt-5" onClick={() => submitRating()}>Enviar</button>
				</div>
		)
}

export default Rating;
