import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import db from '../../config/DBConnection';
import { login_core } from '../../config/endpoints';
import Loading from '../GeneralComponents/Loading';
import Axios from 'axios';

const LoginWithCore = (props) => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.loading)

    useEffect(() => {
        if (props.match.params.core === '' || !props.match.params.core) {
            props.history.push(`/${props.match.params.ws}/`)
        }
    }, [props.history, props.match.params.core, props.match.params.ws])

    useEffect(() => {
        (async function loginCore() {
            try {
                dispatch({ type: 'LOADING', payload: true })
                if (props.match.params.core) {
                    try {
                        let headers = { 'Content-Type': 'Application/Json' }
                        const { data } = await Axios.post(login_core, { core: props.match.params.core }, headers)
                        await db.auth().setPersistence(db.auth.Auth.Persistence.LOCAL)
                        await db.auth().signInWithEmailAndPassword(`${data.domain}@${data.pass}.com`, data.pass)
                    } catch (error) {
                        dispatch({ type: 'ERROR', payload: error.message })
                    }
                }
            } finally {
                setTimeout(() => {
                    dispatch({ type: 'LOADING', payload: false })
                }, 3000)
            }
        })()
    }, [dispatch, props.match.params.core])

    return (<>
        {loading ? <Loading /> : <Redirect to={`/`} />}
    </>)
}

export default LoginWithCore;