import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { OTSession, OTPublisher, OTStreams, OTSubscriber, preloadScript } from 'opentok-react';
import Chat from './Chat';

const StartCall = (props) => {
	const dispatch = useDispatch();
	const {session } = useSelector((state) => state.call);
	const [callRef, setCallRef] = useState({});
	const [error, setError] = useState(null);
	const [publishVideo, ] = useState(true);
	const [dni, setDni] = useState('');

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
		accessDenied: () => {
			// console.log('User denied access to media source');
		},
		streamCreated: (e) => {
			// console.log(e)
		},
		streamDestroyed: ({ reason }) => {
			// console.log(`Publisher stream destroyed because: ${reason}`);
			// console.log(reason, props.sala);
			if (props.sala === '' || reason === 'unpublished') {
				props.history.replace(`/feedback`);
			}
			/* callRef.sessionHelper.session.off() */
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
		let vid = document.querySelectorAll('.OTSubscriberContainer .OT_video-element');
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
	};

	const onPublishError = (error) => {
		dispatch({ type: 'SET_PUBLISH_STATUS', payload: 'ERROR' });
		setError(error);
	};

	const onSubscribe = () => {
		dispatch({ type: 'SET_SUBSCRIBE_STATUS', payload: 'SUCCESS' });
	};

	const onSubscribeError = (error) => {
		dispatch({ type: 'SET_SUBSCRIBE_STATUS', payload: 'ERROR' });
		setError(error);
	};

	useEffect(() => {
		if (!!error) {
			if (error.code === 1004) {
				console.log(
					`La conexión no pudo establecerse. La sala ha sido cerrada por el especialista o se ha creado una nueva. Por favor refresque la página o realice una nueva consulta.`
				);
			} else if (error.code === 1500) {
				console.log(
					`No se pudo ingresar a la llamada. Su dispositivo está bloqueando la cámara o el micrófono. Intente refrescar esta página y/o verifique los permisos.`
				);
			}
		}
	}, [error]);

	return (
		<>
			{/* {(publish !== "SUCCESS" || subscribe !== "SUCCESS" || session !== "CONNECTED") && */}
			<Chat />
			<OTSession
				apiKey={'46424032'}
				sessionId={props.sala}
				token={props.token}
				onError={onSessionError}
				eventHandlers={sessionEventHandlers}
				ref={(instance) => setCallRef(instance)}
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
		</>
	);
};

export default preloadScript(withRouter(StartCall));
