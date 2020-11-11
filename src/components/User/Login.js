/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import db from '../../config/DBConnection';
import Loading from '../GeneralComponents/Loading';
import { send_user_code, node_patient } from '../../config/endpoints';
import axios from 'axios';
import { GenericHeader } from '../GeneralComponents/Headers';
import PhoneInput from 'react-phone-input-2';
import MobileLogin from '../../assets/mobileLogin.svg';
import LoginCode from '../../assets/loginCode.svg';
import { checkNum } from '../Utils/stringUtils';
import swal from 'sweetalert';
import 'react-phone-input-2/lib/bootstrap.css';
import '../../styles/generalcomponents/Login.scss';

export const SignOut = () => {
    db.auth().signOut()
    return null
}

const SignIn = props => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [ws, setWs] = useState(props.match.params.ws)
    const [, setSendMsg] = useState(false)
    const [code, setCode] = useState('')
    const loading = useSelector(state => state.front.loading)
    const [sentWs, setSentWs] = useState(true)
    const config =  { headers: { 'Content-Type': 'application/json'} }
     
    useEffect(() => {
        let timeout = setTimeout(() => {
            setSentWs(false)
        }, 2000)
        if (ws && !props.history.location.pathname.includes("login")) {
            console.log(ws)
            dispatch({ type: 'LOADING', payload: true })
            const validPhone = checkNum(ws)
            setWs(validPhone)
            axios.get(`${node_patient}/exists/${validPhone}`, {}, config)
                .then((res) => {
                    if(res.data.redirect === 'register') {
                        props.history.replace(`/register/${validPhone}`)
                    } else {
                        props.history.replace(`/login/${validPhone}`)
                    }
                })
                .catch(err => swal('Ocurrió un error en el Login', `${err}`, 'warning'))
                .finally(() =>  dispatch({ type: 'LOADING', payload: false }))
        }
        return () => clearTimeout(timeout)
    }, [])
    
    const handleLogin = async (event) => {
        event.preventDefault()
        let { password } = event.target.elements
        dispatch({ type: 'LOADING', payload: true })
        let validPhone = `${parseInt(ws)}`
        if (validPhone.slice(0, 2) === '54') {
            if (validPhone.slice(2, 4) === '15' && validPhone.length < 13) {
                validPhone = `${validPhone.slice(0, 2)}911${validPhone.slice(4, validPhone.length)}`
            } else if (validPhone.slice(2, 4) === '11' && validPhone.length < 13) {
                validPhone = `${validPhone.slice(0, 2)}9${validPhone.slice(2, validPhone.length)}`
            } else if (validPhone.slice(2, 4) !== '11' && validPhone.length < 13) {
                validPhone = `${validPhone.slice(0, 2)}911${validPhone.slice(2, validPhone.length)}`
            }
        }
        if (password) {
            localStorage.setItem('accessCode', password.value)
            let email = `${validPhone}@${password.value}.com`;
            db.auth()
                .signInWithEmailAndPassword(email, password.value)
                .then(async (reg) => {
                    window.gtag('event', 'success_login', {
                        'event_category' : 'login',
                        'event_label' : 'login'
                      });
                    history.push(`/${validPhone}`)
                    dispatch({ type: 'LOADING', payload: false })
                    localStorage.setItem('dbUser', true)
                })
                .catch((err) => {
                    window.gtag('event', 'incorrect_code', {
                        'event_category' : 'warning',
                        'event_label' : 'login'
                      });
                    // caso Usuario no encontrado
                    if (err.code === 'auth/user-not-found') {
                        swal('El código introducido no es válido o ya expiró.', '', 'warning')
                        // caso Usuario código de ingreso inválido
                    } else if (err.code === 'auth/wrong-password') {
                        swal('El código introducido no es válido o ya expiró', '', 'warning')
                        // caso ya existe el usuario y el código de ingreso es su pass, entonces lo logueo
                    } else if (err.code === 'auth/email-already-in-use') {
                        db.auth().setPersistence(db.auth.Auth.Persistence.LOCAL)
                            .then(() => {
                                db.auth()
                                    .signInWithEmailAndPassword(`${validPhone}@${code}.com`, code)
                                    .then(() => history.push(`/${validPhone}`))
                            })
                    } else swal(err, '', 'warning')
                    setTimeout(() => {
                        dispatch({ type: 'LOADING', payload: false })
                    }, 5000)
                })
        } else if (!password) {
            props.history.push(`/login/${validPhone}`)
            setSendMsg(true)
            dispatch({ type: 'LOADING', payload: false })
        } else {
            swal('El código es incorrecto o expiró', '', 'warning')
            dispatch({ type: 'LOADING', payload: false })
        }
    }



    const sendWsCode = useCallback(async (ws) => {
        setSentWs(true)
        let accessCode = localStorage.getItem('accessCode')
        // let validEmail = `${ws}@${code}.com`;
        if (accessCode && code && accessCode === code) {
            db.auth().setPersistence(db.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    db.auth()
                        .signInWithEmailAndPassword(`${ws}@${code}.com`, code)
                        .then((ok) => props.history.push(`/${ws}`))
                })
        } else {
            const data = { ws }
            const headers = { 'Content-type': 'application/json'  }
            await axios.get(`${node_patient}/exists/${ws}`, {}, config)
                .then(async (res) => {
                    if(res.data.redirect === 'register') {
                        const confirmAction = await swal({
                            title: 'Confirmación',
                            text: `El número ${ws} no se encuentra registrado. Serás redireccionado al registro`,
                            icon: 'warning',
                            buttons: true,
                        })
                        if(confirmAction) props.history.replace(`/register/${ws}`)
                    } else {
                        axios.post(`${send_user_code}/${ws}`, data, { headers })
                            .then(() => {
                                swal('Código enviado! Revise su WhatsApp', '', 'success')
                                props.history.push(`/login/${ws}`)
                            })
                            .catch((err) => {
                                swal('Error al enviar el código', '', 'warning')
                            })
                    }
                })
                .catch(err => swal('Ocurrió un error en el Login', `${err}`, 'warning'))
                .finally(() =>  dispatch({ type: 'LOADING', payload: false }))
        }
    }, [sentWs])

    function checkNumSend() {
        const validPhone = checkNum(ws)
        setWs(validPhone)
        if(validPhone.length > 10 && validPhone.length < 14) {
            sendWsCode(validPhone)
        } else {
            swal('No es un número válido', 'Verifica el número introducido', 'warning')
        }
    }

    return (
        <>
            {loading ?
                <Loading />
                :
                <>
                    <div className='text-center loginWrapper'>
                        <GenericHeader children='Login' profileDisabled={true}>Login</GenericHeader>
                        <form onSubmit={handleLogin}>
                            {!props.match.params.ws || props.match.params.ws === 'NaN' ?
                                <>
                                    <div className='codeHelper'>
                                        <div className='imageContainer'>
                                            <img src={MobileLogin} alt='mobile login helper' />
                                        </div>
                                        <label className='form-label mb-2 text-center' htmlFor='user'>
                                            Ingrese su número de teléfono para recibir el código de ingreso por whatsapp.
                                        </label>
                                    </div>
                                    <PhoneInput
                                        className='phoneNumber'
                                        country='ar'
                                        preferredCountries={['ar', 'py', 'uy', 've', 'br', 'pr', 'do', 'ur', 'bo', 'mx', 'co', 'pa']}
                                        value={ws}
                                        onChange={(value) => setWs(value)}
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            autoFocus: true
                                        }}
                                        containerStyle={{ width: '100%', height: '100%', marginTop: '17px' }}
                                        inputStyle={{ width: '100%', height: '100%' }}
                                        autoFormat={false}
                                    />
                                    <button className='btn btn-blue-lg buttonSendLogin' onClick={() => checkNumSend()} type='button'>
                                        Enviar
                                    </button>
                                </>
                                :
                                <>
                                    <div className='ml-5 mt-2 mb-3 mr-5'>
                                        <label className='form-label mb-0 mt-2' htmlFor='password'>
                                            <small>Presione <strong>"Enviar código"</strong></small>
                                        </label>
                                    </div>
                                    <div className='passwordLabelWrapper'>
                                        <div className='imageContainer'>
                                            <img src={LoginCode} alt='mobile login helper' />
                                        </div>
                                        <label className='form-label mb-0 mt-2' htmlFor='password'>
                                            <small>Para ingresar verifique el código que ha llegado a su <strong>WhatsApp</strong>.</small>
                                        </label>
                                    </div>
                                    <input
                                        className='passwordInput form-control w-100'
                                        name='password'
                                        type='text'
                                        placeholder='Ingrese su código'
                                        value={code}
                                        onChange={e => setCode(e.target.value.toLowerCase())}
                                        autocomplete="off"
                                        required
                                    />
                                    <button disabled={!code ? true : false} className='btn btn-blue-lg buttonSendLogin' type='submit'>
                                        Ingresar
                                    </button>
                                    <small>Si no recibe el código puede  <a href='https://api.whatsapp.com/send?phone=5491123000066&text=Hola' className='register'>hablarle a ÜMA por whatsapp</a> para acceder.</small>
                                    {sentWs === false ?
                                        <button className='btn btn-blue-lg buttonSendCode mt-5' onClick={() => sendWsCode(ws)} type='button'>
                                            Reenviar código
                                        </button> :
                                        <button className='btn btn-blue-lg disabled buttonSentCode' type='button'>
                                            Código enviado!
                                        </button>}
                                </>}
                        </form>
                        <small className='text-center'>
                            <a href='https://api.whatsapp.com/send?phone=5491123000066&text=Hola' className='register'>Aún no estoy registrado</a>
                        </small><br />
                    </div>
                </>
            }
        </>
    );
};

export default withRouter(SignIn);