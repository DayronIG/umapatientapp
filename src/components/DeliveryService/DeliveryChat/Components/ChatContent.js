import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useChat } from './useChat';
import axios from 'axios';
import moment from 'moment-timezone';
import { uploadFileToFirebase } from "../../../Utils/postBlobFirebase";
import BubbleChat from './ChatBubbleComponent'
import './Chat.scss';

const config = { headers: { 'Content-Type': 'application/json' } };

function jsUcfirst(string = '') {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ({ bubble }) => {
	const [corporation] = useState("uma")
	const [user] = useState("patient")
	const patient = useSelector(state => state.user) 
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService) 
	const {incidente_id} = useParams()
	const docId = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]?.docId) || incidente_id
	const [isInternal, setIsInternal] = useState(true)
	const { messages, newMsj, setNewMsgActive } = useChat(isInternal);
	const token = localStorage.getItem('token');


	// function postDataConversation(postValue, corporation) {
	// 	let date = moment(new Date()).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
	// 	corporation = corporation.replace(/[^a-zA-Z ]|\s/g, '')
	// 	if (!postValue) return null;
	// 	try {
	// 		const userInternal = user.replace('-', '')
	// 		const data = {
	// 			ws: isInternal ? userInternal : corporation,
	// 			dni: isInternal ? userInternal : corporation,
	// 			dt: date,
	// 			cuil: isInternal ? userInternal : corporation || '',
	// 			assignation_id: isInternal ? `${date.slice(0, 10)}_${userInternal}` : `${date.slice(0, 10)}_${corporation}` || '',
	// 			rol: 'doctor',
	// 			text: postValue || '',
	// 		};
	// 		console.log("POST")
	// 		axios.post('https://uma-v2.appspot.com/transcripcion', data, config);
	// 	}
	// 	catch (error) {
	// 		console.log(error);
	// 	}
	// }

	function postDataConversation(inputValue) {
				let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
				// 'Accept': 'text/plain' 
	      		const userInternal = user.replace('-', '')
				if (inputValue !== '') {
					var data = {
						'ws': patient.ws,
						'dni': patient.dni,
						'dt': date,
						'cuil': isInternal ? userInternal : corporation || '',
						'assignation_id': docId,
						'rol': 'patient',
						'text': inputValue || ''
					}
					let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
					axios.post('https://uma-v2.appspot.com/transcripcion', data, { headers })
						.then((res) => {
							// setInputValue('')
							// scrollToBottom()
						})
						.catch(function (err) {
						})
				} else {
					console.error("Hay que escribir un mensaje")
				}
			}

	return (
		<div className='chat__container--bubble'>
			<BubbleChat
				isInternal={isInternal}
				bubble={bubble}
				notification={{ not: newMsj, setNot: setNewMsgActive }}
				messages={messages}
				onPostMsg={(msg) => postDataConversation(msg, corporation)}
				onPostFile={async (file) => {
					const date = moment(new Date()).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
					const url = await uploadFileToFirebase(file[0], `${corporation}/uploadedimageschat/${date}`);
					postDataConversation(url, corporation);
				}}
			/>
		</div>
	);
};
