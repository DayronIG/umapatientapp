import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import Firebase from 'firebase/app';
import axios from 'axios';
import { node_patient } from "../../config/endpoints"
import { GoogleButton, MicrosoftButton, EmailButton } from '../User/LoginButtons';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import swal from 'sweetalert';
import '../../styles/home/addemail.scss';


const EmailForm = (props) => {
    const dispatch = useDispatch()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false)
    const [passValidation, setPassValidation] = useState({ validPass: false, validRepetition: false })
    const { currentUser } = useSelector((state) => state.userActive)
    const user = useSelector((state) => state.user)

    const _validateForm = useCallback((e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value)
            let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
            if(valid) { 
                setValidEmail(true)
            } else {
                setValidEmail(false)
            }
        } else if (e.target.name === "pass") {
            setPassword(e.target.value)
            if (e.target.value.length < 6) {
                setPassValidation({ ...passValidation, validPass: false })
            } else {
                setPassValidation({ ...passValidation, validPass: true })
            }
        } else if (e.target.name === "passrepeat") {
            if (e.target.value !== password) {
                setPassValidation({ ...passValidation, validRepetition: false })
            } else {
                setPassValidation({ ...passValidation, validRepetition: true })
            }
        }
    }, [passValidation, password])

    const _submitForm = useCallback(async (e) => {
        if(!passValidation.validPass || !passValidation.validRepetition || !validEmail) {
            swal("Revisa los datos", "Por favor, revisa los datos introducidos", "warning")
            return ""
        }
        dispatch({type: "LOADING", payload: true})
        // var credential = Firebase.auth.EmailAuthProvider.credential(email, password)
        // var provider = await new Firebase.auth.GoogleAuthProvider();
        let oldUser = user.email
        let code = user.email.split('@')[1].slice(0,6)
        if(parseInt(user.email.split('@')[1].slice(0,6)).length < 5) {
            code = user.ws_code
        }
        Firebase.auth()
            .signInWithEmailAndPassword(user.email, code)
            .then(async function(userCredential) {
                await userCredential.user.updateEmail(email)
                await userCredential.user.updatePassword(password)
                await userCredential.user.updateProfile({displayName: user.ws})
                await currentUser.getIdToken().then(async token => { 
                    let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                    let data = {
                        newValues: {
                            login: 'email',
                            ws_code: code,
                            email: email || user.email,
                            password: password
                        }}
                    console.log(data)
                    await axios.patch(`${node_patient}/${user.dni}`, data, {headers})
                        .then(res => {
                            console.log("Ok")
                            dispatch({type: 'CLOSE_MODAL'})
                            dispatch({type: 'SET_USER_LOGIN', payload: 'email'})
                            dispatch({type: "LOADING", payload: false})
                        })
                })
            })
            .catch(err => {
                console.log(err)
                if(err.message === "The email address is already in use by another account.") {
                    swal("Esta cuenta ya está en uso", "Intenta con otro email o logueate con la cuenta ya existente", "warning")
                }
                dispatch({type: "LOADING", payload: false})
            })

    }, [email, password, validEmail, passValidation])

    return <div className="addEmail__container">
        <div className="addEmail__title">Necesitamos que completes algunos datos</div>
        <div className="addEmail__text">
            Tienes tiempo hasta el 31 de Enero para completar tus datos.
        </div>
        <form className="addEmail__form" autoComplete="off">
            <label htmlFor="email" className="addEmail__label">Email*</label>
            <input
                type="email"
                name="email"
                placeholder="ejemplo@mail.com"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopaasdasde"
            ></input>
             {validEmail ? <div className="addEmail__success">
                <IoIosCheckmarkCircleOutline />
                <span>Email válido</span>
            </div> :
                <div className="addEmail__warning">
                    <MdRadioButtonUnchecked />
                    <span>Introduzca un email válido</span>
            </div>}
            <label htmlFor="pass" className="addEmail__label">Contraseña*</label>
            <input
                type="password"
                name="pass"
                placeholder="contraseña"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopes"
            ></input>
            {passValidation.validPass ? <div className="addEmail__success">
                <IoIosCheckmarkCircleOutline />
                <span>Contraseña válida</span>
            </div> :
                <div className="addEmail__warning">
                    <MdRadioButtonUnchecked />
                    <span>Mínimo 6 caracteres</span>
                </div>}
            <label htmlFor="passrepeat" className="addEmail__label">Confirmar contraseña</label>
            <input
                type="password"
                name="passrepeat"
                placeholder="contraseña"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopes"
            ></input>
            {passValidation.validRepetition ? <div className="addEmail__success">
                <IoIosCheckmarkCircleOutline />
                <span>Confirmación válida</span>
            </div> :
                <div className="addEmail__warning">
                    <MdRadioButtonUnchecked />
                    <span>Las contraseñas no coinciden</span>
                </div>
            }
        </form>
        <div className="addEmail__actions">
            <button onClick={() => _submitForm()} className="btn btn-lg-blue">Confirmar</button>
            <span className="addEmail__actionSkip" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Ahora no</span>
        </div>
    </div>
}


const Advice = ({setAdvice}) => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.userActive)
    const user = useSelector((state) => state.user)

    const linkAccount = async (type) => {
        dispatch({type: "LOADING", payload: true})
        let provider
        if(type === "google") {
            provider = new Firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
        } else if(type === "microsoft") {
            provider = new Firebase.auth.OAuthProvider('microsoft.com');
        }
        await currentUser.linkWithPopup(provider)
            .then(async function (result) {
                var credential = result.credential;
                let loginMethod = credential.providerId || 'social'
                await currentUser.getIdToken().then(async token => { 
                    let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                    let code = user.email.split('@')[1].slice(0,6) 
                    if(parseInt(user.email.split('@')[1].slice(0,6)).length < 5) {
                        code = user.ws_code
                    }
                    let data = {
                        newValues: {
                            login: loginMethod,
                            ws_code: code,
                            email: result.additionalUserInfo.profile.email || user.email,
                            picture: result.additionalUserInfo.profile.picture
                        }}
                await axios.patch(`${node_patient}/${user.dni}`, data, {headers})
                    .then(res => console.log("Ok"))
                })
                dispatch({type: 'CLOSE_MODAL'})
                dispatch({type: 'SET_USER_LOGIN', payload: type})
                dispatch({type: "LOADING", payload: false})
            }).catch(function (error) {
                console.log(error)
                dispatch({type: "LOADING", payload: false})
            });
    }

    const _unlinkProvider = (login) => {
        currentUser.unlink('google.com').then(function() {
            console.log("Desvinculado")
          }).catch(function(error) {
            console.log(error)
          });
    }


    return <div className="addEmail__container">
        <div className="addEmail__title">¡Tenemos novedades!</div>
        <div className="addEmail__text">
            A partir de febrero vas a tener una <b>nueva forma de ingresar</b> a ÜMA. <br />
            Solo tienes que <b>vincular tu cuenta</b> con el email que usarás para ingresar.
        </div>
        <div className="addEmail__action">
            <GoogleButton buttonText="Vincular con Google" action={() => linkAccount("google")}></GoogleButton>
            <MicrosoftButton buttonText="Vincular con Microsoft" action={() => linkAccount("microsoft")}></MicrosoftButton>
            <EmailButton buttonText="Vincular con otra cuenta" action={() => setAdvice(false)}></EmailButton>
            <span className="addEmail__actionSkip" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Ahora no</span>
            <button onClick={() => _unlinkProvider(user.login)} className="btn btn-lg-blue">Desvincular</button>
        </div>
    </div>
}


const AddEmail = (props) => {
    const dispatch = useDispatch()
    const [showAdvice, setAdvice] = useState(true)


    return (
        <MobileModal hideCloseButton={true} callback={() => dispatch({ type: 'CLOSE_MODAL' })}>
            {showAdvice ? <Advice setAdvice={setAdvice}/> : <EmailForm {...props}/>}
        </MobileModal>)
}

export default AddEmail