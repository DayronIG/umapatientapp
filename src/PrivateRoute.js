import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from "./components/User/Auth";
import LoginComponent from "./components/User/Login";
import db from './config/DBConnection';
import Loading from './components/GeneralComponents/Loading';
import ToastNotification from '../src/components/GeneralComponents/toastNotification'
import tone from '../src/assets/ring.mp3'

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
    const { patient } = useSelector(store => store.queries)
    const [notification, setNotification] = useState(false)
    const { callRejected } = useSelector(store => store.call)

    useEffect(() => {
        if (patient.ws) {
            try {
                let subscription, queryUser = firestore.doc(`auth/${patient.ws}`)
                subscription = queryUser.onSnapshot(async function (doc) {
                    if (doc.data()?._start_date && doc.data()._start_date !== '') {
                        let data = doc.data()?._start_date.split('///')
                        if (!callRejected && doc.data()?._start_date !== "geo" && rest.path !== '/:dni/onlinedoctor/attention/'){
                            setNotification(true)
                            dispatch({ type: 'SET_CALL_ROOM', payload: { room: data?.[0], token: data?.[1] } })
                        }
                    } else {
                        setNotification(false)
                        dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '' } })
                    }
                })
                return () => {
                    if (typeof subscription === 'function') subscription()
                }
            } catch (error) {
                console.log(error)
            }
        }
    }, [patient, RouteComponent, firestore, callRejected, rest.path, dispatch])

    return (

        <>
            {notification && <>
                <ToastNotification
                    title={'LLAMADA ENTRANTE...'}
                    button={'Contestar'}
                    action={`/${patient.dni}/onlinedoctor/attention/`}
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