/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import { node_patient } from '../config/endpoints';
import axios from 'axios';
import { install_event } from '../config/endpoints';
import app from '../config/DBConnection';
import Loading from '../components/GeneralComponents/Loading';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import MobileModal from '../components/GeneralComponents/Modal/MobileModal';
import {getCountry} from '../components/Utils/getCountry.js';
import Welcome from './Welcome';
import swal from 'sweetalert';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import '../../src/styles/generalcomponents/register.scss';
import {generatePassword} from '../components/Utils/generatePassword';

const Register = props => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {ws: urlWS, ref} = useParams();
    const [registered, setRegistered] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = React.useState();
    const [termsSwitch, setTermsSwitch] = useState(true);
    const [modalDisplay, ] = useState(false);
    const loading = useSelector(state => state.front.loading);
    //const urlWS = props.match.params.ws
    const { dni: getId, day: getDay, month: getMonth, year: getYear,
        dt: getDate, sex: getSex, ws: getWs, os: getOs, fullname: getFullname, country } = useSelector(state => state.register);
    const monthRef = useRef();
    const yearRef = useRef();

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        })
        if(urlWS.length < 12) {
            swal('Error', 'Este no es un teléfono válido.', 'warning');
            history.push('/');
        } else {
            dispatch({ type: 'REGISTER_FIRST_WS', payload: urlWS });
            dispatch({ type: 'REGISTER_FIRST_OS', payload: ref });
            getCountryCode();
            generatePassword();
        }
    }, [dispatch, props.match]);

    async function getCountryCode() {
        let code = await getCountry(urlWS)
        dispatch({ type: 'REGISTER_FIRST_COUNTRY', payload: code })
    }

    const handleSignUp = async event => {
        window.gtag('event', 'sign_up');
        event.preventDefault()
        window.scroll(0, 0)
        let dniAlert = await swal({
            title: `Confirma tu número de documento: ${getId}`,
            text: `Ten en cuenta que si es incorrecto, las fichas médicas/órdenes/recetas/constancias no tendrán validez y no se podrán modificar posteriormente.`,
            icon: 'warning',
            buttons: {cancel: 'Corregir', catch: { text: 'Confirmar', value: true }},
            dangerMode: true,
        })
        if (dniAlert && termsSwitch && getFullname.length >= 7) {
            dispatch({ type: 'LOADING', payload: true })
            let pwd = generatePassword()
            let user = `${getWs}@${pwd}.com`
            localStorage.setItem('codeRegistered', pwd)
            try {
                await app.auth()
                    .createUserWithEmailAndPassword(user, pwd)
                    .then(reg => handleSubmit(reg.user.uid, reg.user, pwd))
                    .catch(err => {
                        if (err.code === 'auth/email-already-in-use') {
                            swal('Ya existe el usuario',
                                'Este teléfono ya está registrado para un usuario.',
                                'warning')
                        }
                        else swal('Error', err, 'warning')
                        dispatch({ type: 'LOADING', payload: false })
                    })
            } catch (error) {
                swal('Error', 'Ocurrió un error desconocido. Por favor, intente de nuevo más tarde.', 'warning')
            }
        } else if (getFullname.length <= 8){
            swal('Aviso', 'Debes completar tu nombre y apellido completos', 'warning')
        } else if (!dniAlert) {
            return null
        } else {
            swal('Aviso', 'Para registrarte debes aceptar los términos y condiciones de UMA', 'warning')
        }
    }

    let composeDate = () => {
        if(!!parseInt(getMonth) && !!parseInt(getDay) && !!parseInt(getYear)){
            let buildDate = new Date(getMonth + '/' + getDay + '/' + getYear)
            let birth = moment(buildDate).format('YYYY-MM-DD')
            let date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            dispatch({ type: 'REGISTER_FIRST_DOB', payload: birth })
            dispatch({ type: 'REGISTER_FIRST_DT', payload: date })
            return date
        }
    }

    let handleSubmit = async (reg, user, pwd) => {
        dispatch({ type: 'LOADING', payload: true })
        dispatch({ type: 'REGISTER_FIRST_CORE', payload: reg })
        let dt = composeDate()
        let subscription
        if (ref && ref.toLowerCase().includes('rappi_peru')) {
            subscription = 'AUT'
        }
        let dob = `${getYear}-${getMonth}-${getDay}`
        let dni = getId 
        if(country !== null && country !== "AR") {
            dni = `${country}${getId}`
        }
        let data = {
            patient: {
                affiliate: props.match?.params?.affiliate,
                geohash: '',
                lat: '',
                lon: '',
                street: '', 
                address: '', // getAddress.concat(', ' + getCity) ||
                referral: '',
                group: dni,
                country: country || 'AR',
                core_id: reg || '',
                dni: dni || '',
                sex: getSex || '',
                dob: dob || '',
                ws: urlWS || '',
                dt: dt || '',
                corporate: getOs || '',
                fullname: getFullname || '',
                email: user.email,
                subscription,
            }
        }
        if (data.sex != '') {
            let headers = { ContentType: 'Application/json' }
            try {
                const res = await axios.post(`${node_patient}`, data, headers)
                if (res && res.affiliate !== 'rappi') {
                    setTimeout(() => {
                        dispatch({ type: 'SET_STATUS', payload: 99 });
                        setRegistered(true)
                        dispatch({ type: 'LOADING', payload: false })
                    }, 2000)
                } else if (res.creates === true) {
                    setTimeout(() => {
                        dispatch({ type: 'LOADING', payload: false })
                        history.push('/')
                    }, 2000)
                } else {
                    dispatch({ type: 'LOADING', payload: false })
                }
            } catch (res) {
                user.delete()
                if(res.response?.data?.message === "Ya existe un usuario con este documento") {
                    window.gtag('event', 'repeated_document', {
                        'event_category' : 'warning',
                        'event_label' : 'register'
                      });
                }
                setTimeout(() => {
                    swal('Error',
                    `No se pudo completar tu registro. ${res?.response?.data?.message}. Por favor comunícate a info@uma-health.com`,
                    'warning')
                    setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 1500)
                }, 2500)
            }
        }
    }

    const onChangeDay = e => {
        dispatch({ type: 'REGISTER_FIRST_DAY', payload: e.target.value })
        if (e.target.value.length === 2) monthRef.current.focus()
    }

    const onChangeMonth = e => {
        dispatch({ type: 'REGISTER_FIRST_MONTH', payload: e.target.value })
        if (e.target.value.length === 2) yearRef.current.focus()
    }

    const showInstallPrompt = () => {
        if (deferredPrompt !== undefined) {
            deferredPrompt.prompt()
            deferredPrompt.userChoice
                .then((choiceResult) => {
                    let date = moment(new Date()).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss')
                    let data = {
                        ws: urlWS,
                        dni: getId,
                        dt: date,
                        lat: '',
                        lon: '',
                        event: 'INSTALL'
                    }
                    let headers = { 'Content-Type': 'Application/Json' }
                    if (choiceResult.outcome === 'accepted') {
                        axios.post(install_event, data, headers)
                        history.push('/')
                    } else {
                        history.push('/')
                    }
                })
                .catch(err => {
                    history.push('/')
                })
        }
    }

    const handleDni = (dni) => {
        const reg = /^\d+$/
        const str = dni.toString()
        const isNumber = reg.test(str)
        if (isNumber) dispatch({ type: 'REGISTER_FIRST_DNI', payload: dni })
        else if (!dni) dispatch({ type: 'REGISTER_FIRST_DNI', payload: '' })
    }

    return (
        <>
            {loading && <Loading />}
            {registered ?
                <Welcome showInstallPrompt={() => showInstallPrompt()} />
                :
                <div className="register__container">
                    <GenericHeader profileDisabled={true}>Registro</GenericHeader>
                    {modalDisplay && (
                        <MobileModal title='¡Registro exitoso!' hideCloseButton={true}>
                            <div className='contentData'>¡Te registraste con éxito!</div>
                            <div className='buttonContainer'>
                                <a href='/'>
                                    <button className='btn btn-active buttonSuccess'>
                                        Ir al inicio de la aplicación
                                    </button>
                                </a>
                            </div>
                        </MobileModal>
                    )}
                    {urlWS !== 'undefined' ?
                        <form className='registerWrapper register-form mt-2' onSubmit={e => handleSignUp(e)}>
                            <div className='col-sm-12'>
                                <label className='form-label' htmlFor='name'>
                                    Nombre y apellido
                                </label>
                                <input
                                    className='form-input' id='name' placeholder='Nombre'
                                    autoComplete='on' type='text'
                                    onChange={e => dispatch({ type: 'REGISTER_FIRST_FULLNAME', payload: e.target.value })}
                                    required
                                />
                                <label className='form-label' htmlFor='dni'>
                                    Identificación, cédula o DNI
                                </label>
                                <input
                                    className='form-input' id='dni' placeholder='e.g. 99899899' autoComplete='on'
                                    onChange={e => handleDni(e.target.value)} value={getId} required />
                                <div className='d-flex justify-content-start align-items-end'>
                                    <div className='birthContainer w-50'>
                                        <label className='form-label birthLabel'>
                                            Fecha de nacimiento
                                        </label>
                                        <div className='d-flex birthInputContainer'>
                                            <input className='form-mid-input mr-2'
                                                onChange={e => onChangeDay(e)} type='number' min='1'
                                                max='31' name='bday' id='dateDay' placeholder={getDay} maxLength='2'
                                                required />
                                            <input
                                                className='form-mid-input mr-2' maxLength='2' ref={monthRef}
                                                onChange={e => onChangeMonth(e)}
                                                type='number' min='1' max='12'
                                                name='bMonth' id='dateMonth'
                                                placeholder={getMonth}
                                                required />
                                            <input
                                                className='form-mid-input mr-2' id='dateYear' placeholder={getYear}
                                                maxLength='4' ref={yearRef} type='number' min='1900' max='2020' name='bYear'
                                                onChange={e => dispatch({ type: 'REGISTER_FIRST_YEAR', payload: e.target.value })}
                                                required />
                                        </div>
                                    </div>
                                    <div className='sexContainer w-50'>
                                        <select
                                            className='form-mid-input'
                                            style={{ height: '65%' }}
                                            id='gender'
                                            onChange={e => dispatch({ type: 'REGISTER_FIRST_SEX', payload: e.target.value })}
                                            placeholder={getSex}
                                            required >
                                            <option value=''>Género</option>
                                            <option value='M'>Masculino</option>
                                            <option value='F'>Femenino</option>
                                            <option value='O'>Otro</option>
                                        </select>
                                    </div>
                                </div>
                                {!ref && <input
                                    className='form-input' id='os' placeholder='Cobertura / Seguro de Salud'
                                    autoComplete='off' type='text'
                                    onChange={e => dispatch({ type: 'REGISTER_FIRST_OS', payload: e.target.value })}
                                    required
                                />}
                            </div><br />
                            <div className='d-flex justify-content-between pl-3 pr-3'>
                                <a href='https://uma-health.com/terminos_usuarios' target='_blank' rel="noopener noreferrer">
                                    <small>Acepto los términos y condiciones</small>
                                </a>
                                <div className={termsSwitch ? 'enabled switchChangeWrapper' : 'disabled switchChangeWrapper'}>
                                    <Switch type='checkbox'
                                        id='medicalVisit'
                                        checked={termsSwitch}
                                        name='medicalVisit'
                                        onChange={() => setTermsSwitch(!termsSwitch)}
                                    />
                                </div>
                            </div>
                            <div className='text-right'>
                                <button className='btn sendButtonStyles' type='submit'>
                                    Enviar
                                </button>
                            </div>
                            <div className='text-center link mb-4'
                                onClick={() => history.push(`/login`)}>
                                Ya tengo un usuario (Ingresar)
                            </div>
                        </form>
                        :
                        <div className='whatsapp-container'>
                            <p className='p-2 mt-5 text-center'>
                                Para iniciar el registro por favor dígale 'Hola' a UMA por whatsapp (<a href='tel:5491123000066'>5491123000066</a>)  y recibirá su link de registro.
                            </p>
                        </div>}
                </div>}
        </>
    )
}

export default Register