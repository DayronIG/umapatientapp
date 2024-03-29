import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OTSession, OTPublisher, OTStreams, OTSubscriber, preloadScript } from 'opentok-react';
import Chat from './Chat';
import { IoIosChatbubbles } from 'react-icons/io';
import { MdCallEnd } from 'react-icons/md';
import swal from 'sweetalert';

const StartCall = (props) => {
	const dispatch = useDispatch();
	const history = useHistory()
	const { session, assignation_id } = useSelector((state) => state.call);
	const { current } = useSelector((state) => state.assignations);
	const [error, setError] = useState(false);
	const [publishVideo, ] = useState(true);
	const [dni, setDni] = useState('');
	const [showChat, setShowChat] = useState(false);


	const sessionEventHandlers = {
		sessionConnected: () => {
			dispatch({ type: 'SET_SESSION_STATUS', payload: 'CONNECTED' });
		},
		sessionDisconnected: () => {
			dispatch({ type: 'SET_SESSION_STATUS', payload: 'DISCONNECTED' });
		},
		sessionReconnected: () => {
			dispatch({ type: 'SET_SESSION_STATUS', payload: 'RECONNECTING' });
		},
		sessionReconnecting: () => {
			dispatch({ type: 'SET_SESSION_STATUS', payload: 'CONNECTING' });
		},
	};

	const publisherEventHandlers = {
		streamDestroyed: ({ reason }) => {
			if (props.sala === '' || reason === 'unpublished') {
				console.log('')
				history.replace(`/feedback?assignation_id=${assignation_id}&activeUid=${props.activeUid}&dependant=${props.dependant}`);
			}
		},
	};

	const subscriberEventHandlers = {
		videoEnabled: () => {
			console.log('Subscriber video enabled');
		},
		videoDisabled: () => {
			console.log('Subscriber video disabled');
		},
	};

	useEffect(() => {
		setDni(dni);
		navigator.getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
		let constraints = {
			audio: false,
			video: { facingMode: 'user' },
		};
		let r, e;
		if (navigator.mediaDevices) {
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((res) => (r = res))
				.catch((err) => (e = err));
		} else if (navigator.getUserMedia) {
			navigator.getUserMedia(constraints, r, e);
		}
	}, [dni]);

	const onSessionError = (error) => {
		dispatch({ type: 'SET_SESSION_STATUS', payload: 'ERROR' });
		setError(error);
	};

	const onPublish = () => {
		dispatch({ type: 'SET_PUBLISH_STATUS', payload: 'SUCCESS' });
		setError(false)
	};

	const onPublishError = (error) => {
		dispatch({ type: 'SET_PUBLISH_STATUS', payload: 'ERROR' });
		setError(error);
	};

	const onSubscribe = () => {
		dispatch({ type: 'SET_SUBSCRIBE_STATUS', payload: 'SUCCESS' });
		setError(false)
	};

	const onSubscribeError = (error) => {
		dispatch({ type: 'SET_SUBSCRIBE_STATUS', payload: 'ERROR' });
		setError(error);
	};

	useEffect(() => {
		if (!!error) {
			if (error.code === 1004) {
				console.log(
					`La conexión no pudo establecerse. La sala ha sido cerrada por el especialista o se ha creado una nueva. Por favor refresque la página o realice una nueva consulta. ${error.message}`
				);
			} else if (error.code === 1500) {
				console.log(
					`No se pudo ingresar a la llamada. Su dispositivo está bloqueando la cámara o el micrófono. Intente refrescar esta página y/o verifique los permisos. ${error.message}`
				);
			}
		}
	}, [error]);

	const callEnd = useCallback(async () => {
		const confirmAction = await swal({
			title: '¿Seguro desea salir de la consulta?',
			icon: 'warning',
			buttons: true,
		})
		if (confirmAction) {
			history.replace(`/feedback?assignation_id=${assignation_id}&activeUid=${props.activeUid}&dependant=${props.dependant}`);
		}
	}, [assignation_id])

	return (
		<>
			{
				props.token === '.' && !showChat &&
				<div className='chatProposal__container'>
					<p>
						Si tiene algún problema de conexión o su médico no contesta inmediatamente puede escribir por chat.
					</p>
				</div>
			}

			{
				!showChat && 
				<>
				{current.path_profile_pic && current.fullname && 
				<div className="doctorInfo__container">
					<div className="doctorInfo__profilePic"><img src={current.path_profile_pic} alt={current.fulname} /></div>
					<div className="doctorInfo__fullname">{current.fullname}</div>
				</div>}
				<div className="bubbles__container">
					<button className="bubbleChat" onClick={() => setShowChat(true)}><IoIosChatbubbles /></button>
					<button className="bubbleDisconnect" onClick={() => callEnd(true)}><MdCallEnd /></button>
				</div>
				</>
			}
			{
				showChat && <Chat visible={(v) => setShowChat(v)} />
			}
			{ props.token !== '.' && props.session !== '.' && 
			<OTSession
				apiKey={'46424032'}
				sessionId={props.sala}
				token={props.token}
				onError={onSessionError}
				eventHandlers={sessionEventHandlers}
				className='opentok'>
				<>
					<div className='PatientContainerMedia'>
						<OTPublisher
							properties={{
								publishVideo,
								width: '20vw',
								height: '20vh',
								style: { buttonDisplayMode: 'off' },
							}}
							onPublish={onPublish}
							onError={onPublishError}
							eventHandlers={publisherEventHandlers}
						/>
					</div>
					<div
						className='DoctorContainerMedia'
						style={!session ? { display: 'none' } : { display: 'inherit' }}>
						{!!error ? (
							<div className='error'>
								<strong></strong>
							</div>
						) : (
							<OTStreams>
								<OTSubscriber
									properties={{ width: 100, height: 100 }}
									onSubscribe={onSubscribe}
									onError={onSubscribeError}
									eventHandlers={subscriberEventHandlers}
								/>
							</OTStreams>
						)}
					</div>
				</>
			</OTSession>
			}
		</>
	);
};

export default preloadScript(StartCall);
