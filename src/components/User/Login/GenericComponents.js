import React, { useState, useCallback, useEffect } from 'react';
import Firebase from 'firebase/app';
import db from '../../../config/DBConnection';
import {useHistory} from 'react-router-dom';
import {checkNum} from '../../Utils/stringUtils';
import {useDispatch, useSelector} from 'react-redux';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
import Modal from '../SignUp/Modal';
import moment from 'moment-timezone';
import showPass from '../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../assets/icons/eyeopenpass.png';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Facebook from '../../../assets/logos/facebook.png';
import Mobile from '../../../assets/logos/mobile.png';
import Email from '../../../assets/logos/email.png';
import CalendarIcon from '../../../assets/calendar.png'; 
import '../../../styles/user/genericComponents.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'react-date-range';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import {node_patient} from '../../../config/endpoints';

export const GenericInputs = ({label, type, name = ''}) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)    
    const [passValidation, setPassValidation] = useState({ validPass: false, validRepetition: false })
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [selectSwitch, setSelectSwitch] = useState(false)
    const [labelUp, setLabelUp] = useState(false)
    const [validations, setValidations] = useState([{
        firstname: false,
        lastname: false,
        dni: false,
        phone: false
    }])


    const _validateForm = useCallback((e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value)
            let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
            if(valid) { 
                dispatch({ type: 'USER_FIRST_EMAIL', payload: e.target.value })
                setValidEmail(true)
            } else {
                setValidEmail(false)
            }
        } else if (e.target.name === 'pass') {
            setPassword(e.target.value)
            if (e.target.value.length < 6) {
                setPassValidation({ ...passValidation, validPass: false })
            } else {
                dispatch({ type: 'USER_PASSWORD', payload: e.target.value })
                setPassValidation({ ...passValidation, validPass: true })
            }
        } else if (e.target.name === 'passrepeat') {
            if (e.target.value !== password) {
                setPassValidation({ ...passValidation, validRepetition: false })
            } else {
                dispatch({ type: 'USER_PASSWORD', payload: e.target.value })
                setPassValidation({ ...passValidation, validRepetition: true })
            }
        } else if (e.target.name === 'phone') {
            if (checkNum(e.target.value)) {
                let num = checkNum(e.target.value)
                dispatch({ type: 'USER_PHONE_NUMBER', payload: num })
                setValidations({ ...validations, phone: true })
            } else {
                setValidations({ ...validations})
            }
        } else if (e.target.name === 'dni') {
            if (e.target.value.length >= 7 && e.target.value.length <= 8) {
                dispatch({ type: 'USER_FIRST_DNI', payload: e.target.value })
                setValidations({ ...validations, dni: true })
            } else {
                setValidations({ ...validations})
            }
        } else if (e.target.name === 'firstname') {
            let valid = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
            if(valid) { 
                dispatch({ type: 'USER_FIRST_NAME', payload: e.target.value }) 
                setValidations({ ...validations, firstname: true })
            } else {
                setValidations({ ...validations})
            }
        } else if (e.target.name === 'lastname') {
            let valid = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
            if(valid) { 
                dispatch({ type: 'USER_LAST_NAME', payload: e.target.value })
                setValidations({ ...validations, lastname: true })
            } else {
                setValidations({ ...validations})
            }
        } else if (e.target.name === 'healthinsurance') {
            dispatch({ type: 'USER_FIRST_OS', payload: e.target.value }) 
        }

    }, [passValidation, password, validations])

    console.log(validations)

    return (
        <div className='form'>
            <input
                name={name}
                type={showPassword ? 'text' : type}
                className='form--input' 
                onChange={(e) => _validateForm(e)}
                onClick={()=> setLabelUp(true)}
            />
            <label className={labelUp ? 'form--label up' : 'form--label'}>
                {label}
            </label>

            {type === 'password' ? 
                <img 
                    src={showPassword ? eyeOpenPass : showPass} 
                    alt='password' 
                    onClick={() => 
                    setShowPassword(!showPassword)} 
                    className='form--eyePass'
                /> :
                null
            }
        </div>
    )
};

export const SelectOption = ({calendar, select}) => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [date, setDate] = useState()
    const dispatch = useDispatch()
    const [validations, setValidations] = useState([{
        dob: false,
        sex: false
    }])

    const handleDate = (e) => {
        const momentDate = moment(e).format('DD-MM-YYYY')
        const olderThan = moment().diff(e, 'years') 
        if(olderThan >= 16) {
            dispatch({ type: 'USER_FIRST_DOB', payload: momentDate })
            setValidations({...validations, dob: true})
        }else {
            setValidations({...validations})
        }
    }

    const getValue = (e) => {
        if(e.target.value) {
            dispatch({ type: 'USER_FIRST_SEX', payload: e.target.value }) 
            setValidations({ ...validations, sex: true })
        } else {
            setValidations({...validations})
        }
    }

    return (
        <>
        {showCalendar && 
        <section className='calendar__container'>
            <Modal>
            <Calendar
                date={new Date()}
                onChange={(e) => handleDate(e)}
            />
                <section className='calendar__actions'>
                    <button onClick={()=> setShowCalendar(!showCalendar)} className='calendar__actions-btn cancel'>Cancelar</button>
                    <button className='calendar__actions-btn done' onClick={()=> setShowCalendar(!showCalendar)}>Hecho</button>
                    <button onClick={()=> setShowCalendar(!showCalendar)} className='calendar__actions-btn-close'>x</button>
                </section>
            </Modal>
        </section>
        }
        {calendar &&  
        <section className='birth__date' onClick={() => setShowCalendar(!showCalendar)}  >
            <p className='text'>Selecciona tu fecha de nacimiento</p>
            <img src={CalendarIcon} alt='Icono de calendario' className='icon--calendar' />
        </section>}
        {select && 
        <div className='container__select--sex'>
            <select className='select--sex' required onChange={(e)=>getValue(e)} >
                <option selected disabled>Indica tu sexo</option>
                <option value='femenino'>Femenino</option>
                <option value='masculino'>Masculino</option>
                <option value='otro'>Otro</option>
            </select>
        </div>
        }
        </>
    )
}

export const ConditionButtons = () => {
    return(
        <section className='conditions'>
            <div className='conditions__input'>
                <input type='radio'/> <label>Mínimo 8 caracteres</label>
            </div>
            <div className='conditions__input'>
                <input type='radio'/> <label>Mínimo 1 número</label>
            </div>
        </section>
    )
}

export const GenericButton = ({color, children, action = () => {}}) => {
    //Aciones de rutas
    return (
        <button className={color === 'blue' ? 'action-btn' : 'action-btn white'} onClick={action}>{children}</button>
    )
};

export const LoginButtons = ({circleBtn, signUp, vincular}) => {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.userActive);

    const signInAndSignUpWithGoogle = (route) => {
        let googleProvider;
        googleProvider = new Firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');

        db.auth().signInWithPopup(googleProvider)
            .then(result => {
                console.log(result.user);
                history.push(route);
            })
            .catch(e => {
                console.log(e.code);
            })
    }
    
    const handleGoogleAccount = async () => {
        if (circleBtn) {
            signInAndSignUpWithGoogle('/');
        } else if(vincular) {
            let provider
            provider = new Firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            await currentUser.linkWithPopup(provider)
                .then(async function (result) {
                    let credential = result.credential;
                    let loginMethod = credential.providerId || 'social'
                    await currentUser.getIdToken().then(async token => {
                        let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                        let code = user.email.split('@')[1].slice(0, 6)
                        if (parseInt(user.email.split('@')[1].slice(0, 6)).length < 5) {
                            code = user.ws_code
                        }
                        let data = {
                            newValues: {
                                login: [loginMethod],
                                ws_code: code,
                                email: result.additionalUserInfo.profile.email || result.additionalUserInfo.profile.mail || provider.email || user.email,
                                picture: result.additionalUserInfo.profile.picture
                            }
                        }
                        await result.user.updateProfile({ displayName: user.ws })
                        await axios.patch(`${node_patient}/${user.dni}`, data, { headers })
                            .then(res => console.log("Ok"))
                    })
                }).catch(function (err) {
                    if (err.message === "The email address is already in use by another account.") {
                        console.error("Esta cuenta ya está en uso", "Intenta con otro email o logueate con la cuenta ya existente", "warning")
                    } else if (err.message === "User can only be linked to one identity for the given provider.") {
                        console.error("Ya tienes una cuenta este proveedor vinculada", "No se puede vincular más de una cuenta del mismo sitio. Intenta con otro email.", "warning")
                    } else if (err.message === "This credential is already associated with a different user account.") {
                        console.error("Ya tienes otra cuenta vinculada", "No se puede vincular más de una cuenta del mismo sitio.", "warning")
                    }
                });
        } else if (signUp) {
            signInAndSignUpWithGoogle('/signup/form/2');
        } else {
            signInAndSignUpWithGoogle('/');
        }
    }

    const handleAnotherAccount = () => {
        if (circleBtn) {
            history.push('/login/phone');
        } else if (vincular) {

        } else if (signUp) {
            history.push('/signup/form/1');
        } else {

        }
    }

    return (
        <section className={circleBtn ? 'login__buttonGroup' : 'login__buttonGroup column'}>
            <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleGoogleAccount}>
                <img src={Google} alt='Google logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Google</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Google </p> }
            </button> 
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Microsoft} alt='Microsoft logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Microsoft</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Microsoft</p>  }
            </button>
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Facebook} alt='Facebook logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Facebook</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Facebook</p>  }
            </button>
            <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleAnotherAccount}>
                <img src={circleBtn ? Mobile : Email} alt='Mobile image'/>
                { circleBtn ? null : signUp ? <p>Registrarme con otra cuenta</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con otra cuenta</p>  }
            </button> 
        </section>
    )
};

export const TextAndLink = ({text, link, action}) => {
    // Cambian las rutas registrarme / ingresar / enviar por otro medio
    return(
        <section className='textAndLink' onClick={action}>
            <p>{text}</p>
            <a href='#'>{link}</a>
        </section>
    )
}

export const Stepper = ({complete}) => {
    const [steps, setSteps] = useState([
        { active: 0, circle:false },
        { active: 0, circle:false },
        { active: 0, circle:false },
        { active: 0, circle:false }
    ])

    useEffect(() => {
        switch (complete) {
            case 1: {
                let newArr = [...steps];
                newArr[0].circle = true;
                setSteps(newArr)
            }
            break;
            
            case 2: {
                let newArr = [...steps];
				newArr[0].active = 1;
                newArr[1].circle = true;
                setSteps(newArr)
            }
            break;

            case 3: {
                let newArr = [...steps];
                newArr[0].active = 1;
                newArr[1].active = 1;
                newArr[2].circle = true;
                setSteps(newArr)
            }
            break;
            
            case 4: {
                let newArr = [...steps];
                newArr[0].active = 1;
                newArr[1].active = 1;
                newArr[2].active = 1;
                newArr[3].circle = true;
                setSteps(newArr)
            }
            break;
            default: 
                return false;
        }
    }, [complete])

    return(
        <ul className='stepper'>
            {
                steps.map((item, index) => <li key={index} className={`step ${item.active == 1? 'complete' : ''} ${item.circle == true? 'circle' : ''}`}></li>)
            }
        </ul>
    )
}
