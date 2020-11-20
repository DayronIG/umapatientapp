/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import { node_patient } from '../config/endpoints';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {generatePassword} from '../components/Utils/generatePassword';
import 'react-datepicker/dist/react-datepicker.css';
import app from '../config/DBConnection';
import Loading from '../components/GeneralComponents/Loading';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import MobileModal from '../components/GeneralComponents/Modal/MobileModal';
import {getCountry} from '../components/Utils/getCountry.js';
import swal from 'sweetalert';
import moment from 'moment';
import { validateInput } from '../components/Utils/stringUtils';
import { installPrompt } from '../components/Utils/installPrompt';
import 'moment-timezone';
import '../styles/generalcomponents/referredRegister.scss';

const Register = props => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [registered, setRegistered] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = React.useState()
    const [termsSwitch, setTermsSwitch] = useState(true)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [modalDisplay, ] = useState(false)
    const loading = useSelector(state => state.front.loading)
    const {ws, ref, affiliate} = useParams()
    const {
        dni: getId, day: getDay, month: getMonth, year: getYear,
        dt: getDate, sex: getSex, ws: getWs, os: getOs, fullname: getFullname, country
     } = useSelector(state => state.user)
    const dayRef = useRef()
    const monthRef = useRef()
    const yearRef = useRef()
    const [errors, setErrors] = useState({});
    const [state, setState] = useState('');

    useEffect(() => {
        if(window.innerWidth > 768){
            setState('desktop');
        }
    },[])


    useEffect(() => {
        const promptListener = (e) => {
          e.preventDefault()
          setDeferredPrompt(e)
        }
        window.addEventListener('beforeinstallprompt', promptListener)
        return () => {
          window.removeEventListener('beforeinstallprompt', promptListener);
        }
    }, [])

    useEffect(() => {
        if(ws?.length < 12) {
            swal('Error', 'Este no es un teléfono válido.', 'warning')
            history.push('/home')
        } else {
            dispatch({ type: 'USER_FIRST_WS', payload: ws })
            dispatch({ type: 'USER_FIRST_OS', payload: ref })
            getCountryCode()
            generatePassword()
        }
    }, [dispatch])

    async function getCountryCode() {
        if(getWs){
            let code = await getCountry(getWs)
            dispatch({ type: 'USER_FIRST_COUNTRY', payload: code })
        }
    }

    const handleSignUp = useCallback(async event => {
        event.preventDefault()
        window.scroll(0, 0)
        let dniAlert = false
        let dt = composeDate()
        let validDni = validateInput('text', getId)
        let validFullname = validateInput('text', getFullname)
        let validOs = validateInput('text', getOs)
        let validWs = validateInput('tel', getWs)
        let validDate = validateInput('number', dt)

        if(validDni && validFullname && validOs && validDate && validWs) {
            dniAlert = await swal({
                title: `Confirma tu número de documento: ${getId}`,
                text: `Ten en cuenta que si es incorrecto, las fichas médicas/órdenes/recetas/constancias no tendrán validez y no se podrán modificar posteriormente.`,
                icon: 'warning',
                buttons: {cancel: 'Corregir', catch: { text: 'Confirmar', value: true }},
                dangerMode: true,
            })
        }
        
        if (validDni && validFullname && dniAlert && termsSwitch && validOs && validDate) {
            dispatch({ type: 'LOADING', payload: true })
            let pwd = generatePassword()
            let user = `${getWs}@${pwd}.com`
            localStorage.setItem('codeRegistered', pwd)
            try {
                return await app.auth()
                    .createUserWithEmailAndPassword(user, pwd)
                    .then(reg => handleSubmit(reg.user.uid, reg.user, pwd))
                    .catch(err => {
                        console.log(err)
                        if (err.code === 'auth/email-already-in-use') {
                            swal('Ya existe el usuario',
                                'Este teléfono ya está registrado para un usuario.',
                                'warning')
                        }
                        else { swal('Error', JSON.stringify(err), 'warning') }
                        dispatch({ type: 'LOADING', payload: false })
                    })
            } catch (error) {
                return swal('Error', 'Ocurrió un error desconocido. Por favor, intente de nuevo más tarde.', 'warning')
            }
        } 
        const errors = {};
        if(!validDni) {
            errors.dni = true;
        } 
        if (!validFullname){
            errors.nombre = true;
        } 
        if(!validOs){
            errors.cobertura = true;
        }
        if(!validWs){
            errors.ws = true;
        } 
        if(!validDate){
            errors.bDay = true;
            errors.bMonth = true;
            errors.bYear = true;
        }
        setErrors(errors);
        if(!termsSwitch) {
            swal('Aviso', 'Para registrarte debes aceptar los términos y condiciones de UMA', 'warning')
        }
    }, [errors])

    let composeDate = () => {
        if(!!parseInt(getMonth) && !!parseInt(getDay) && !!parseInt(getYear)){
            let buildDate = new Date(getMonth + '/' + getDay + '/' + getYear)
            let birth = moment(buildDate).format('YYYY-MM-DD')
            let date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            dispatch({ type: 'USER_FIRST_DOB', payload: birth })
            dispatch({ type: 'USER_FIRST_DT', payload: date })
            return date
        }
    }

    let handleSubmit = async (reg, user) => {
        let dt = composeDate()
        dispatch({ type: 'LOADING', payload: true })
        dispatch({ type: 'USER_FIRST_CORE', payload: reg })
        let subscription
        let source = affiliate // To do move to back
        if (source && source.toLowerCase().includes('rappi_peru')) {
            subscription = 'AUT'
        }
        let dob = `${getYear}-${getMonth}-${getDay}`
        let dni = getId 
        if(country !== null) {
            dni = `${country}${getId}`
        }
        let data = {
            patient: {
                affiliate: affiliate || '',
                geohash: '',
                lat: '',
                lon: '',
                street: '', 
                address: '', // getAddress.concat(', ' + getCity) ||
                referral: '',
                group: dni,
                country: country || '',
                core_id: reg || '',
                dni: dni || '',
                sex: getSex || '',
                dob: dob || '',
                ws: getWs || '',
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
                        // history.push(`/${ws}/redirectws`)
                    }, 2000)
                } 
                if(ref === "hisopado"){
                    history.push(`/hisopado/${ws}`)
                }
            } catch (res) {
                user.delete()
                setTimeout(() => {
                    swal('Error',
                    `No se pudo completar tu registro. ${res?.response?.data?.message}. Por favor comunícate a info@uma-health.com`,
                    'warning')
                    setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 2000)
                }, 2500)
            }
        }
    }

    const handleInput = (typeDispatch) => (event) => {
        var { type, value, name } = event.target;
        if(typeDispatch === "USER_FIRST_YEAR"){type="number"}
        const isValid = validateInput(type, value);
        if(!isValid && value !== "") {
            dispatch({ type: typeDispatch, payload: value })
            return setErrors({ ...errors, [name]: true });
        } else if (value === "") { 
            dispatch({ type: typeDispatch, payload: '' })
        } else {
            setErrors({ ...errors, [name]: false });
            dispatch({ type: typeDispatch, payload: value })
        }
    }

    return (
        <>
            {loading && <Loading />}
                <>
                    <GenericHeader profileDisabled={true}></GenericHeader>
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
                    {ws !== 'undefined' ?
                    <div className="register__container">
                        <h3 className='register_form--title'>Formulario de registro</h3> 
                        <form className='registerWrapper register-form' onSubmit={e => handleSignUp(e)}>
                            <div className='d-flex flex-wrap'>
                            <div className="form__spanWrapper">
                                <label className='form-label' htmlFor='name'>
                                    Nombre y apellido* 
                                </label>
                                <input className='form-input' id='name' placeholder='Nombre'
                                autoComplete='off' name='nombre' type='text'onChange={handleInput('USER_FIRST_FULLNAME')} />
                                 {errors.nombre && (
                                    <p className="form__validation--error">x Debe ingresar su nombre y apellido</p>
                                )}
                            </div>
                            <div className="form__spanWrapper">
                                <label className='form-label' htmlFor='dni'>
                                    Identificación, cédula o DNI*
                                </label>
                                <input className='form-input' id='dni' name='dni' type='text' placeholder='e.g. 99899899' autoComplete='off'
                                onChange={handleInput('USER_FIRST_DNI')} value={getId} />
                                {errors.dni && (
                                    <p className="form__validation--error">x Debe ingresar su identificación</p>
                                )}
                            </div>
                            
                            
                            {!ws && 
                            <div className="form__spanWrapper">
                                <label className='form-label' htmlFor='celular'>
                                    N° de celular
                                </label>
                                <input className='form-input' name='ws' id='ws' placeholder='(54) 11 33678925' autoomplete='off'
                                onChange={handleInput('USER_FIRST_WS')}  value={getWs? getWs: ""}  />
                                {errors.ws && (
                                    <p className="form__validation--error">x Debe ingresar un número de celular válido</p>
                                )}
                            </div>}
                            {!ref &&
                            <div className="form__spanWrapper">
                            <label className='form-label' htmlFor='cobertura'>
                            Cobertura / Seguro de Salud
                                </label>
                             <input
                                className='form-input' id='os' placeholder='ej: Unión Personal'
                                autoComplete='off' type='text'
                                onChange={handleInput('USER_FIRST_OS')}
                                name='cobertura'
                                
                            />
                            {errors.cobertura && (
                                    <p className="form__validation--error">x Debe ingresar su cobertura o seguro de salud</p>
                                )}
                            </div>}
                            <div className='form__spanWrapper'>                              
                                    <label className='form-label birthLabel'>
                                        Fecha de nacimiento* 
                                    </label>
                                    <div className='inputsContainer'>
                                        <input className='form-mid-input'
                                            onChange={(e) => {
                                                handleInput('USER_FIRST_DAY')(e);
                                                if(e.target.value.length === 2) monthRef.current.focus();
                                            }} type='number' min='1'
                                            max='31' name='bday' id='dateDay' placeholder={getDay}
                                            ref={dayRef} maxLength='2'
                                             />
                                            
                                        <input
                                            className='form-mid-input' maxLength='2' ref={monthRef}
                                            onChange={(e) => {
                                                handleInput('USER_FIRST_MONTH')(e);
                                                if(e.target.value.length === 2) yearRef.current.focus();
                                            }}
                                            type='number' min='1' max='12'
                                            name='bMonth' id='dateMonth'
                                            placeholder={getMonth}
                                             />
                                        <input
                                            maxLength='4' className='form-mid-input form__midInput--year' id='dateYear' placeholder={getYear}
                                            ref={yearRef} type='text' inputMode="numeric" name='bYear'
                                            onChange={handleInput('USER_FIRST_YEAR')}
                                            
                                        />
                                        <select
                                            className='form-mid-input'
                                            id='gender'
                                            onChange={e => dispatch({ type: 'USER_FIRST_SEX', payload: e.target.value })}
                                            placeholder={getSex}
                                            >

                                            <option value=''>Sexo</option>
                                            <option value='M'>Masculino</option>
                                            <option value='F'>Femenino</option>
                                        </select>                                        
                                        <span className="form__validation--error label__absolute">
                                            {(errors.bday || errors.bMonth || errors. bYear) && 'x Debe ingresar una fecha válida'}                                            
                                        </span>
                                    </div>                                
                            </div>
                            </div>
                            <div className='switch__container'>
                                <a href='https://uma-health.com/terminos_usuarios' target='_blank' rel="noopener noreferrer">
                                    <h5 className="text__terminosYcondiciones ml-5 ">Acepto los términos y condiciones</h5>
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
                                <button className='sendButtonStyles' type='submit'>
                                    Enviar
                                </button>          
                               
                            </div>
                        </form>
                    </div>
                        :
                        <div className='whatsapp-container'>
                            <p className='p-2 mt-5 text-center'>
                                Para iniciar el registro por favor dígale 'Hola' a UMA por whatsapp (<a href='tel:5491123000066'>5491123000066</a>)  y recibirá su link de registro.
                            </p>
                            <a href='https://wa.me/5491123000066/?text=Hola'>
                                <div className='btn btn-blue-lg'>Enviar saludo a UMA</div>
                            </a>
                        </div>
                    }
                </>
                 <small className="d-flex justify-content-center mb-5">¿Ya tienes un usuario? <a className="link_to_login" href="/login">Ingresá</a></small>
        </>
    )
}

export default Register;
