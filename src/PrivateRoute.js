import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from "./components/User/Auth";
// ----- Login
import LoginComponent from "./components/User/Login/Login";
import NeedHelp from './components/User/Login/ForgottenPass/NeedHelp';
import ForgottenPass from './components/User/Login/ForgottenPass/ForgottenPass';
import ResetPass from './components/User/Login/ForgottenPass/ResetPass';
import ConfirmAcc from './components/User/Login/ForgottenPass/ConfirmAcc';
import ForgottenAccError from './components/User/Login/ForgottenPass/ForgottenAccError';
// ------- SignUp
import SignUp from './components/User/SignUp/SignUp';
import Register from './components/User/SignUp/Register';
import ConfirmationCode from './components/User/SignUp/ConfirmationCode';
import ConfirmationMail from './components/User/SignUp/ConfirmationMail';
import Status from './components/User/SignUp/Status';
// ------- Login Phone Number
import LoginPhoneNumber from './components/User/Login/LoginPhoneNumber/LoginPhoneNumber';
import WelcomeAgain from './components/User/Login/LoginPhoneNumber/WelcomeAgain';
//--------
import TermsConditions from './components/DeliveryService/DeliveryPurchase/Components/TermsConditions';
//--------
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
        return <LoginComponent/>
        //---{Login Telefono}---
            // <WelcomeAgain/>
            // <LoginPhoneNumber/>
        //---{Sign Up}---
            // <Status/>
            // <ConfirmationMail/>
            // <ConfirmationCode/>
            // <Register/>
            //  <SignUp/>
        // ---{Forgot Password or Email}---
            // <ForgottenAccError/>
            // <ResetPass/>
            // <ConfirmAcc/>
            // <ForgottenPass />
            // <NeedHelp/>
        // ---{Login}---
            // <LoginComponent />
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
    const { callRejected } = useSelector(state => state.call)
	const token = useSelector(state => state.userActive.token)

    useEffect(() => {
        if (user.ws) {
            try {
                let subscription, queryUser = firestore.doc(`auth/${user.ws}`)
                subscription = queryUser.onSnapshot(async function (doc) {
                    let data = doc.data()
                    if (data && data?._start_date !== '' && data._start_date) {
                        let calldata = data?._start_date?.split('///')
                        if (!callRejected && !rest.path.includes('/attention/')) {
                            setNotification(true)
                            dispatch({ type: 'SET_CALL_ROOM', payload: { room: calldata?.[0], token: calldata?.[1], assignation: calldata?.[2] } })
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
    }, [user, firestore, callRejected, rest.path])

    useEffect(() => { // Get Device info and save messaging token(push notifications)
		if (user.dni !== "" && currentUser && currentUser.email) {
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
	}, [user, currentUser, token])

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
		let data = {
			newValues: { device },
        };
        currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
            Axios
                .patch(`${node_patient}/${user.dni}`, data,  {headers: headers })
                .then((res) => {
                    console.log("UMA");
                })
                .catch((err) => {
                    console.log(err);
                });
            })
    }, [user, currentUser])
    
    return (

        <>
            {notification && <>
                <ToastNotification
                    title={'LLAMADA ENTRANTE...'}
                    button={'Contestar'}
                    action={`/onlinedoctor/attention/${user.dni}`}
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