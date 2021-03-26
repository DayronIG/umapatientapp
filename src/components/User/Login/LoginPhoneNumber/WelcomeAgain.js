import React, { useState, useEffect } from 'react';
// import '../../../../styles/user/signUp/signUp.scss';
import Logo from '../../../../assets/logo.png';
import { ConditionButtons, GenericButton, GoogleButton, FacebookButton, MicrosoftButton, EmailButton } from '../GenericComponents';
import showPass from '../../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../../assets/icons/eyeopenpass.png';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Firebase from 'firebase/app';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { node_patient } from "../../../../config/endpoints";
import MobileModal from '../../../GeneralComponents/Modal/MobileModal';
import Exclamation from '../../../../assets/illustrations/exclamation.png';

const WelcomeAgain = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm();
    const [vincular, setVincular] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [modal, setModal] = useState(false);
    const user = useSelector(state => state.user);
    const { currentUser } = useSelector((state) => state.userActive);
    const {method} = useParams();

    useEffect(() => {
        if(!Firebase.auth().currentUser) {
            dispatch({ type: 'RESET_USER_DATA' });
            history.push('/');
        }
    }, [])

    useEffect(() => {
        if(method) {
            setVincular(false);
        }
    }, [method])

    const linkAccountWithEmailAndPassword = (dataVal) => {
        if(dataVal.password !== dataVal.passrepeat) {
            return false;
        }

        let code = user.email.split('@')[1].slice(0, 6)
        if (parseInt(user.email.split('@')[1].slice(0, 6)).length < 5) {
            code = user.ws_code
        }
        Firebase.auth()
            .signInWithEmailAndPassword(user.email, code)
            .then(async function (userCredential) {
                await userCredential.user.updateEmail(dataVal.email)
                await userCredential.user.updatePassword(dataVal.password)
                await userCredential.user.updateProfile({ displayName: user.ws })
                await currentUser.getIdToken().then(async token => {
                    let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                    let data = {
                        newValues: {
                            login: ['email'],
                            ws_code: code,
                            email: dataVal.email || user.email,
                            password: dataVal.password
                        }
                    }
                    await axios.patch(`${node_patient}/update/${currentUser.uid}`, data, { headers })
                        .then(res => {
                            dispatch({ type: 'SET_USER_LOGIN', payload: ['email'] })
                            history.push('/')
                        })
                })
            })
            .catch(err => {
                showModalError(err.code);
                dispatch({ type: "LOADING", payload: false })
            })
    }

    const showModalError = (error) => {
        switch (error) {
            case "auth/credential-already-in-use":
            case "auth/email-already-in-use":
                setErrorMessage('Ya tienes otra cuenta vinculada a ese email');
                setModal(true);
            break;
            default:
                setErrorMessage('Hubo un error al vincular su cuenta');
                setModal(true);
            break;
        }
    }

    const deleteUserAndLogin = () => {
        try {
            Firebase.auth().currentUser.delete()
                .then(() => {
                    dispatch({ type: 'RESET_USER_DATA' });
                    history.push('/');
                })
                .catch(e => {
                    dispatch({ type: 'RESET_USER_DATA' });
                    history.push('/');
                });
        } catch (e) {
            dispatch({ type: 'RESET_USER_DATA' });
            history.push('/');
        }
    }

    return (
        <section className='login'>
            <img src={Logo} alt='Logo UMA' className='login__logo' />
            <section className='login__titleAndSub'>
                <h1 className='title'>¡Te damos la bienvenida nuevamente!</h1>
                <p className='subtitle'>Antes de ingresar, necesitamos que vincules una cuenta de email.</p>
                <p className='subtitle'>Esto te servirá para recuperar tu cuenta o contraseña en caso que las olvides.</p>
            </section>
            {vincular ? 
                <>
                    {
                        modal &&
                        <MobileModal hideCloseButton hideTitle >
                            <img src={Exclamation} className='modal__img' alt='Simbolo de exclamacion' />
                            <p className='modal__text'>{errorMessage}</p>
                            <div className='actionModal__btns'>
                                <button className='button-action log' onClick={deleteUserAndLogin}>Ingresar con esa cuenta</button>
                                <button 
                                    className='button-action next' 
                                    onClick={() => {
                                        setModal(false);
                                        setErrorMessage('');
                                    }}
                                >
                                    Intentar con otro método
                                </button>
                            </div>
                        </MobileModal>
                    }
                    <section className="login__buttonGroup column">
                        <GoogleButton vincular handleErrors={(error) => showModalError(error)} />
                        <FacebookButton vincular />
                        <MicrosoftButton vincular />
                        <EmailButton vincular />
                    </section>
                </>
            :
            <section className='login__mobile'> 
                {/* teléfono */}
                <form className='login__mobile__form'>
                    <label className='login__mobile__form--label'>Mail</label>
                    <input 
                        name='email'
                        type='email' 
                        className='login__mobile__form--input' 
                        placeholder='ejemplo@mail.com'
                        // value={email}
                        autoComplete='off'
                        ref={register(
                            { 
                                required: true, 
                                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                            }
                        )}
                    />
                    {errors.email && errors.email.type === "required" && <p className='invalidField'>Campo obligatorio</p>}
                    {errors.email && errors.email.type === "pattern" && <p className='invalidField'>Ingrese un mail válido</p>}
                    <div className='login__mobile__form--pass'>
                        <label className='login__mobile__form--label'>Contraseña</label>
                        <input 
                            name='password'
                            type={showPassword ? 'text' : 'password'} 
                            className='login__mobile__form--input--pass' 
                            placeholder='password123'
                            onChange={(e)=> setPassword(e.target.value)}
                            ref={
                                register(
                                    { 
                                        required: true, 
                                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
                                    }
                                )
                            }
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                        />
                        <img src={showPassword ? eyeOpenPass : showPass } onClick={()=> setShowPassword(!showPassword)} className='login__mobile__form--img' alt='Eye closed'/>
                    </div>    
                    {/* <img src={showPassword ? eyeOpenPass : showPass } className='login__mobile__form--img-confirm' alt='Eye closed'/> */}
                    {errors.password && errors.password.type === "required" && <p className='invalidField'>Campo obligatorio</p>}
                    {errors.password && errors.password.type === "pattern" && <p className='invalidField'>La contraseña debe tener un mínimo de 8 carácteres y al menos un número</p>}
                    <ConditionButtons check={password}/>
                    
                    <label className='login__mobile__form--label'>Confirmar contraseña</label>
                    <input 
                        name='passrepeat'
                        type='password' 
                        className='login__mobile__form--input' 
                        placeholder='Contraseña'
                        ref={
                            register(
                                { 
                                    validate: value => value === password || 'Las contraseñas no coinciden'
                                }
                            )
                        }
                    />
                    {errors.passrepeat && <p className='invalidField'>{errors.passrepeat.message}</p>}
                </form>
                <GenericButton action={handleSubmit(linkAccountWithEmailAndPassword)}>Confirmar datos</GenericButton>
            </section>
            }
        </section>
    )
}

export default WelcomeAgain;
