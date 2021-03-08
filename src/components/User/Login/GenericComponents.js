import React, { useState, useEffect } from 'react';
import Firebase from 'firebase/app';
import db from '../../../config/DBConnection';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
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
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import { Calendar } from 'react-date-range';
// import es from 'date-fns/locale/es';
import axios from 'axios';
import {node_patient} from '../../../config/endpoints'; 
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const GenericInputs = ({label, type, name = '',action = () => {}, inputRef}) => {
    const [showPassword, setShowPassword] = useState(false)    
    const [labelUp, setLabelUp] = useState(false)

    return (
        <div className='form'>
            <input
                name={name}
                type={showPassword ? 'text' : type}
                className='form--input' 
                onClick={()=> setLabelUp(true)}
                onChange={(e)=>action(e)}
                autoComplete='off'
                ref={inputRef}
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
                /> 
                :
                null
            }
            
        </div>
    )
};

// export const SelectOption = ({calendar, select, action = () => {}}) => {
//     const [showCalendar, setShowCalendar] = useState(false)
//     const [calendarValue, setCalendarValue] = useState('')
//     const [date, setDate] = useState(null);
//     const [sex, setSex] = useState(null);
//     const [active, setActive] = useState(false);
//     const [showOptions, setShowOptions] = useState(false);


    // const handleChangeSex = (e) => {
    //     setActive(true)
    //     setSex(e.target.value)
    //     action(e.target.value)
    //     setShowOptions(false)
    // }

        // const handleDate = (e) => {
    //     const momentDate = moment(e).format('DD-MM-YYYY')
    //     const olderThan = moment().diff(e, 'years') 
    //     if(olderThan >= 16) {
    //         setBirthDate(momentDate)
    //         setValidations({...validations, dob: true})
    //     }else {
    //         setValidations({...validations, dob: false})
    //     }
    // }

    // const handleCalendar = (e) => {
    //     setDate(e)
    //     const momentDate = moment(e).format('DD-MM-YYYY')
    //     const olderThan = moment().diff(e, 'years') 
    //     if(olderThan >= 16) {
    //         setCalendarValue(momentDate)
    //         action(momentDate)
    //     }else {
    //         setCalendarValue('')
    //     }
    // }

    // return (
        // <>
            {/* {showCalendar && 
                <section className='calendar__container'>
                    <Modal>
                    <Calendar
                        date={date}
                        onChange={(e)=> handleCalendar(e)}
                        locale={es}
                    />
                        <section className='calendar__actions'>
                            <button onClick={()=> setShowCalendar(()=>setShowCalendar(false))} className='calendar__actions-btn cancel'>Cancelar</button>
                            <button className='calendar__actions-btn done' onClick={(e)=> {e.preventDefault(); setShowCalendar(false)}}>Hecho</button>
                            <button onClick={()=>setShowCalendar(false)} className='calendar__actions-btn-close'>x</button>
                        </section>
                    </Modal>
                </section>
            }
            {calendar &&  
                <section className='birth__date' onClick={()=>setShowCalendar(true)}  >
                    {calendarValue !== '' ? <p className='text date'>{calendarValue}</p> : <p className='text'>Selecciona tu fecha de nacimiento</p>}
                    <img src={CalendarIcon} alt='Icono de calendario' className='icon--calendar' />
                </section>
            } */}
            {/* {select &&
                <div className='container__select--sex'>
                    <button 
                        className={`select--sex ${active ? 'active' : ''}`} 
                        onClick={(e) => {
                            e.preventDefault();    
                            setShowOptions(true);
                        }}
                    >
                        {sex || 'Indica tu sexo'} 
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    <div className={`show--options ${showOptions ? 'visible' : 'hiden'}`}>
                        <label>
                            <input type="radio" name="sexo" value="Femenino" onChange={handleChangeSex} />
                            Femenino
                        </label>
                        <label>
                            <input type="radio" name="sexo" value="Masculino" onChange={handleChangeSex} />
                            Masculino
                        </label>
                        <label>
                            <input type="radio" name="sexo" value="Otro" onChange={handleChangeSex} />
                            Otro
                        </label>
                    </div>
                </div>
            }
        </>
    )
} */}

export const ConditionButtons = ({check}) => {
    const [validPass, setValidPass] = useState(false)
    
    const validate = () => {
        let valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(check)
        if(valid) {
            setValidPass(true)
        }else {
            setValidPass(false)
        }
    }

    useEffect(() => {
       validate()
    }, [check])
    
    return(
    <section className='conditions'>
        <div className='conditions__group'>
            <p className='characters'>Mínimo 8 carácteres</p>
            {validPass && <div className='done'>✔</div>}
        </div>
        <div className='conditions__group'>
            <p className='characters'>Mínimo 1 número</p>
            {validPass && <div className='done number'>✔</div>}
        </div>
    </section>
    )
}

export const GenericButton = ({color, children, action = () => {}}) => {
    return (
        <button className={color === 'blue' ? 'action-btn' : 'action-btn white'} onClick={action}>{children}</button>
    )
};

export const LoginButtons = ({circleBtn, signUp, vincular}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.userActive);

    const signInAndSignUpWithGoogle = (route) => {
        let googleProvider;
        googleProvider = new Firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');

        db.auth().signInWithPopup(googleProvider)
            .then(result => {
                history.push(route);
            })
            .catch(e => {
                console.log(e.code);
            })
    }

    const signInAndSignUpWithMicrosoft = (route) => {
        let microsoftProvider;
        microsoftProvider = new Firebase.auth.OAuthProvider('microsoft.com');
        microsoftProvider.addScope('mail.read');
        microsoftProvider.addScope('calendars.read');

        db.auth().signInWithPopup(microsoftProvider)
            .then(result => {
                history.push(route);
            })
            .catch(e => {
                console.log(e.code);
            })
    }

    const signInAndSignUpWithFacebook = (route) => {
        let facebookProvider;
        facebookProvider = new Firebase.auth.FacebookAuthProvider();
        facebookProvider.addScope('email');
    
        db.auth().signInWithPopup(facebookProvider)
            .then(result => {
                history.push(route);
            })
            .catch(e => {
                console.log(e);
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
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
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

    const handleMicrosoftAccount = async () => {
        if(circleBtn) {
            signInAndSignUpWithMicrosoft('/');
        } else if (vincular) {
            let provider
            provider = new Firebase.auth.OAuthProvider('microsoft.com');
            provider.addScope('mail.read');
            provider.addScope('calendars.read');

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
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
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
            signInAndSignUpWithMicrosoft('/signup/form/2');
        } else {
            signInAndSignUpWithMicrosoft('/');
        }
    }

    const handleFacebookAccount = async () => {
        if (circleBtn) {
            signInAndSignUpWithFacebook('/');
        } else if (vincular) {
            let provider
            provider = new Firebase.auth.FacebookAuthProvider();
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
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
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
            signInAndSignUpWithFacebook('/signup/form/2');
        } else {
            signInAndSignUpWithFacebook('/');
        }
    }

    const handleAnotherAccount = () => {
        if (circleBtn) {
            history.push('/login/phone');
        } else if (vincular) {
            history.push('/login/welcomeAgain/email');
        } else if (signUp) {
            history.push('/signup/form/1');
        } else {
            history.push('/');
        }
    }

    return (
        <section className={circleBtn ? 'login__buttonGroup' : 'login__buttonGroup column'}>
            <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleGoogleAccount}>
                <img src={Google} alt='Google logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Google</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Google </p> }
            </button> 
            <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleFacebookAccount}>
                <img src={Facebook} alt='Facebook logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Facebook</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Facebook</p>  }
            </button>
            <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleMicrosoftAccount}>
                <img src={Microsoft} alt='Microsoft logo'/>
                { circleBtn ? null : signUp ? <p>Registrarme con Microsoft</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Microsoft</p>  }
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
        <section className='textAndLink'>
            <p>{text}</p>
            <a onClick={action}>{link}</a>
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
