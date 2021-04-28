import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter, useHistory } from "react-router-dom";
import { getAntecedents, getBenficiaries } from '../src/store/actions/firebaseQueries';
import { AuthContext } from "./components/User/Auth";
// ----- Login
import LoginComponent from "./components/User/Login/Login";
import db, { askPermissionToRecieveNotifications, firebaseInitializeApp }  from './config/DBConnection';
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
    const firestore = db.firestore(firebaseInitializeApp)
    const history = useHistory()
    const { currentUser } = useContext(AuthContext)
    const user = useSelector(state => state.user)
    const [notification, setNotification] = useState(false)
    const call = useSelector(state => state.call)
	const {token, login} = useSelector(state => state.userActive)
    useEffect(() => {
        let subscription = () => {}
        !localStorage.getItem('last_call_check') && localStorage.setItem('last_call_check', new Date())
        if (user.ws && (moment().diff(new Date(localStorage.getItem('last_call_check')), 'minutes') > 5)) {
            localStorage.setItem('last_call_check', new Date())
            console.log("Check call")
            try {
                let queryUser = firestore.doc(`user/${currentUser.uid}`)
                subscription = queryUser.onSnapshot(async function (doc) {
                    let data = doc.data()
                    if (data?._start_date && data._start_date !== '') {
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
                        if (!call.callRejected && !rest.path.includes('/attention/') && !rest.path.includes('/onlinedoctor/queue/')) {
                            setNotification(true)
                        }
                    } else {
                        setNotification(false)
                        dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '', assignation: '' } })
                    }
                })
            } catch (error) {
                setNotification(false)
                console.log(error)
            }
        }
        return () => {
            if (typeof subscription === 'function') {
                setNotification(false)
                subscription()
            }
        }
    }, [user, firestore, call.callRejected, rest.path])

    useEffect(() => {
        if(currentUser && (localStorage.getItem('beneficiaries') === 'undefined')) {
            dispatch(getBenficiaries(currentUser.uid))
        }else if(localStorage.getItem('beneficiaries') !== 'undefined') {
            dispatch({ type: 'GET_BENEFICIARIES', payload: JSON.parse(localStorage.getItem('beneficiaries'))});
        }
        if(currentUser && (localStorage.getItem('userHistory') === 'undefined')) {
            dispatch(getAntecedents(currentUser.uid)) 
        }else if(localStorage.getItem('userHistory') !== 'undefined') {
            dispatch({type: 'GET_HISTORY', payload: JSON.parse(localStorage.getItem('userHistory'))})
        }
    }, [currentUser])

    useEffect(() => {
        if (user.core_id) {
            if (user.phone || user.ws) {
                if (!login || login === [] || login === "") {
                    history.push('/login/welcomeAgain');
                }
            } else {
                history.push('/signup/form/2');
            }
        }
    }, [user])
    
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
            if(version.patients !== localStorage.getItem('uma_version') || userToken !== localStorage.getItem('messaging_token')) {
				let dt = moment().format('YYYY-MM-DD HH:mm:ss')
				let device = {
						messaging_token: userToken || '',
						device: deviceInfo.osName,
						os: deviceInfo.browser.name,
						last_login: dt,
						uma_version: version.patients
                    }
                localStorage.setItem('uma_version', version.patients)
                localStorage.setItem('messaging_token', userToken)
                console.log("UMA UPDATE")
                await handleSubmit(device)
            } else {
                console.log("UMA OK")
            }
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
                        if(err.response?.data?.message === "user not found") {
                            db.auth(firebaseInitializeApp).signOut()
                            console.log("Signed out")
                            // Si falla el usuario para que no quede en login eterno se lo desloguea
                        }
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