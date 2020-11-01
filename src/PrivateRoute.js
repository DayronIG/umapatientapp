import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from "./components/User/Auth";
import LoginComponent from "./components/User/Login";
import Loading from './components/GeneralComponents/Loading';
import ToastNotification from '../src/components/GeneralComponents/toastNotification'
import tone from './assets/ring.mp3'

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
    const { currentUser } = useContext(AuthContext)
    const { patient } = useSelector(store => store.queries)
    const [notification, setNotification] = useState(false)

    
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