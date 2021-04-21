import React, { useState, useEffect } from 'react';
import Firebase from 'firebase/app';
import db, {firebaseInitializeApp} from '../../../config/DBConnection';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { node_patient } from '../../../config/endpoints'; 
import showPass from '../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../assets/icons/eyeopenpass.png';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Facebook from '../../../assets/logos/facebook.png';
import Mobile from '../../../assets/logos/mobile.png';
import Email from '../../../assets/logos/email.png';
import axios from 'axios';
import '../../../styles/user/genericComponents.scss';

export const GenericInputs = ({label, type, name = '',action = () => {}, inputRef, value}) => {
    const [showPassword, setShowPassword] = useState(false)    
    const [labelUp, setLabelUp] = useState(false)

    return (
        <div className='form'>
            <input
                name={name}
                defaultValue={value ? value : ''}
                type={showPassword ? 'text' : type}
                className='form--input' 
                onClick={()=> setLabelUp(true)}
                onFocus={()=> setLabelUp(true)}
                onChange={(e) => action(e)}
                autoComplete='new-password'
                ref={inputRef}
            />  
            <label className={labelUp || value ? 'form--label up' : 'form--label'}>
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
            <div className='conditions__group'>
                <p className='characters'>Mínimo 1 letra</p>
                {validPass && <div className='done letter'>✔</div>}
            </div>
        </section>
    )
}

export const GenericButton = ({children, action = () => {}}) => {
    return (
        <button className='action-btn' onClick={action}>{children}</button>
    )
};

export const GoogleButton = ({ circleBtn, signUp, vincular, handleErrors }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.userActive);

    const signInAndSignUpWithGoogle = () => {
        let googleProvider;
        googleProvider = new Firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');

        db.auth(firebaseInitializeApp).signInWithPopup(googleProvider)
            .then(result => {
                history.push('/');
            })
            .catch(e => {
                console.error(e);
            })
    }

    const handleGoogleAccount = async () => {
        if (circleBtn) {
            signInAndSignUpWithGoogle();
        } else if (vincular) {
            let provider
            provider = new Firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            const uid = currentUser.uid;

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
                        await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
                    })
                }).catch(function (err) {
                    handleErrors(err.code);
                });
        } else if (signUp) {
            signInAndSignUpWithGoogle();
        } else {
            signInAndSignUpWithGoogle();
        }
    }

    return (
        <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleGoogleAccount}>
            <img src={Google} alt='Google logo'/>
            { circleBtn ? null : signUp ? <p>Registrarme con Google</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Google </p> }
        </button>
    )
}

export const FacebookButton = ({ circleBtn, signUp, vincular, handleErrors }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.userActive);

    const signInAndSignUpWithFacebook = () => {
        let facebookProvider;
        facebookProvider = new Firebase.auth.FacebookAuthProvider();
        facebookProvider.addScope('email');

        db.auth(firebaseInitializeApp).signInWithPopup(facebookProvider)
            .then(result => {
                history.push('/')
            })
            .catch(e => {
                if (e.code === 'auth/email-already-in-use' || e.code === 'auth/account-exists-with-different-credential') {
                    const headers = { 'Content-type': 'application/json' };
                    axios.post(`${node_patient}/emailexists`, { email: e.email }, headers)
                        .then(res => {
                            switch (res?.data?.details[0]?.providerId) {
                                case 'microsoft.com':
                                    history.push('/signup/user/exists/microsoft');
                                    break;
                                case 'google.com':
                                    history.push('/signup/user/exists/google');
                                    break;
                                case 'facebook.com':
                                    history.push('/signup/user/exists/facebook');
                                    break;
                                case 'password':
                                    history.push('/signup/user/exists/password');
                                    break;
                                default:
                                    history.push('/signup/user/exists');
                            }
                        })
                }
            })
    }

    const handleFacebookAccount = async () => {
        if (circleBtn) {
            signInAndSignUpWithFacebook('/');
        } else if (vincular) {
            let provider
            provider = new Firebase.auth.FacebookAuthProvider();
            provider.addScope('email');

            const uid = currentUser.uid;

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
                        await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
                    })
                }).catch(function (err) {
                    handleErrors(err.code);
                });
        } else if (signUp) {
            signInAndSignUpWithFacebook('/signup/form/2');
        } else {
            signInAndSignUpWithFacebook('/');
        }
    }

    return (
        <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleFacebookAccount}>
            <img src={Facebook} alt='Facebook logo' />
            { circleBtn ? null : signUp ? <p>Registrarme con Facebook</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Facebook</p>}
        </button>
    )
}

export const MicrosoftButton = ({ circleBtn, signUp, vincular, handleErrors }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.userActive);

    const signInAndSignUpWithMicrosoft = () => {
        let microsoftProvider;
        microsoftProvider = new Firebase.auth.OAuthProvider('microsoft.com');
        microsoftProvider.addScope('mail.read');
        microsoftProvider.addScope('calendars.read');

        db.auth(firebaseInitializeApp).signInWithPopup(microsoftProvider)
            .then(result => {
                history.push('/')
            })
            .catch(e => {
                if (e.code === 'auth/email-already-in-use' || e.code === 'auth/account-exists-with-different-credential') {
                    const headers = { 'Content-type': 'application/json' };
                    axios.post(`${node_patient}/emailexists`, { email: e.email }, headers)
                        .then(res => {
                            switch (res?.data?.details[0]?.providerId) {
                                case 'microsoft.com':
                                    history.push('/signup/user/exists/microsoft');
                                    break;
                                case 'google.com':
                                    history.push('/signup/user/exists/google');
                                    break;
                                case 'facebook.com':
                                    history.push('/signup/user/exists/facebook');
                                    break;
                                case 'password':
                                    history.push('/signup/user/exists/password');
                                    break;
                                default:
                                    history.push('/signup/user/exists');
                            }
                        })
                }
            })
    }

    const handleMicrosoftAccount = async () => {
        if (circleBtn) {
            signInAndSignUpWithMicrosoft();
        } else if (vincular) {
            let provider
            provider = new Firebase.auth.OAuthProvider('microsoft.com');
            provider.addScope('mail.read');
            provider.addScope('calendars.read');

            const uid = currentUser.uid;

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
                        await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                            .then(res => {
                                dispatch({ type: 'SET_USER_LOGIN', payload: [loginMethod] })
                                history.push('/')
                            })
                    })
                }).catch(function (err) {
                    handleErrors(err.code);
                });
        } else if (signUp) {
            signInAndSignUpWithMicrosoft();
        } else {
            signInAndSignUpWithMicrosoft();
        }
    }

    return (
        <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleMicrosoftAccount}>
            <img src={Microsoft} alt='Microsoft logo' />
            { circleBtn ? null : signUp ? <p>Registrarme con Microsoft</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con Microsoft</p>}
        </button>
    )
}

export const EmailButton = ({circleBtn, signUp, vincular}) => {
    const history = useHistory();

    const handleAnotherAccount = () => {
        if (circleBtn) {
            window.gtag('event', 'login_phone_number')
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
        <button className={circleBtn ? 'login__button' : 'login__button large'} onClick={handleAnotherAccount}>
            <img src={circleBtn ? Mobile : Email} alt='Mobile'/>
            { circleBtn ? null : signUp ? <p>Registrarme con otra cuenta</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con otra cuenta</p>  }
        </button>
    )
};

export const TextAndLink = ({text, link, action, styles}) => {
    // Cambian las rutas registrarme / ingresar / enviar por otro medio
    return(
        <section className={styles? 'textAndLink space' : 'textAndLink'}>
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
