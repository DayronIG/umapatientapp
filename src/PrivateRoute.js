import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from "./components/User/Auth";
// ----- Login
import LoginComponent from "./components/User/Login/Login";
import db, { askPermissionToRecieveNotifications }  from './config/DBConnection';
import Loading from './components/GeneralComponents/Loading';
import ToastNotification from '../src/components/GeneralComponents/toastNotification'
import tone from './assets/ring.mp3'
import isIos from './components/Utils/isIos.js';
import * as DetectRTC from 'detectrtc';
import Axios from "axios";
import { node_patient } from './config/endpoints';
import version from './config/version.json';
import moment from 'moment-timezone';


const Login = () => {
    const [delay, setDelay] = useState(false)

    useEffect(() => {
        let timeout = setTimeout(() => setDelay(true), 2000)
        return () => clearTimeout(timeout)
    }, [])
    
    if (delay) {
        return <LoginComponent />
    } else {
        return <Loading />
    }
}



const PrivateRoute = ({ component: RouteComponent, authed, ...rest }) => {
    const dispatch = useDispatch()
    const firestore = db.firestore()
    const { currentUser } = useContext(AuthContext)
    const user = useSelector(state => state.user)
    const [notification, setNotification] = useState(false)
    const call = useSelector(state => state.call)
	const {token} = useSelector(state => state.userActive)

    useEffect(() => {
        if (user.ws) {
            try {
                let subscription, queryUser = firestore.doc(`user/${currentUser.uid}`)
                subscription = queryUser.onSnapshot(async function (doc) {
                    let data = doc.data()
                    if (data?._start_date && data._start_date !== '') {
                        if (!call.callRejected && !rest.path.includes('/attention/')) {
                            setNotification(true)
                            dispatch({ 
                                type: 'SET_CALL_ROOM', 
                                payload: { 
                                    room: data.call.room,
                                    token: data.call.token, 
                                    assignation: data.call.assignation_id,
                                    dependant: data.call.dependant,
                                    activeUid: data.call.activeUid
                                } 
                            })
                        }
                    } else {
                        setNotification(false)
                        dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '', assignation: '' } })
                    }
                })
                return () => {
                    if (typeof subscription === 'function') {
                        setNotification(false)
                        subscription()
                    }
                }
            } catch (error) {
                setNotification(false)
                console.log(error)
            }
        }
    }, [user, firestore, call.callRejected, rest.path])

    useEffect(() => { // Get Device info and save messaging token(push notifications)
		if (currentUser && currentUser.email) {
			DetectRTC.load(function () {
                    const ios = isIos()
                    if (!ios) {
                        messaginTokenUpdate(currentUser, DetectRTC, true)
                    } else {
                        messaginTokenUpdate(currentUser, DetectRTC, false)
                    }
				})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, token])

	async function messaginTokenUpdate(currentUser, deviceInfo, deviceWithPush) {
		//first we get the messaging token
        let userToken = ''
		if(deviceWithPush) {
            userToken = await askPermissionToRecieveNotifications()
		}
		// now we get the current user
		if (currentUser && currentUser.email) {
			try {
				let dt = moment().format('YYYY-MM-DD HH:mm:ss')
				let device = {
						messaging_token: userToken || '',
						device: deviceInfo.osName,
						os: deviceInfo.browser.name,
						last_login: dt,
						uma_version: version.patients
                    }
                await handleSubmit(device)
			} catch (err) {
				console.log(err)
			}
		}
	}
	
	const handleSubmit = useCallback((device) => {
        setTimeout(() => {
            let data = {
                newValues: { device },
            };
            currentUser.getIdToken().then(async token => {
                let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                Axios
                    .patch(`${node_patient}/update/${currentUser.uid}`, data,  {headers: headers })
                    .then((res) => {
                        console.log("UMA");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
        }, 1500);
    }, [currentUser])
    
    return (

        <>
            {notification && <>
                <ToastNotification
                    title={'LLAMADA ENTRANTE...'}
                    button={'Contestar'}
                    action={`/onlinedoctor/attention/${call.activeUid}?dependant=${call.dependant}`}
                    unsetNotification={setNotification}
                    audio={tone}
                />
            </>}
            <Route
                {...rest}
                render={routeProps =>
                    !!currentUser ? <RouteComponent {...routeProps} /> : <Login />
                }
            />

        </>
    )
}


export default withRouter(PrivateRoute)