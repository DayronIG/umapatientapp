import React, { useState, useEffect } from 'react';
import '../../../../styles/user/signUp/signUp.scss';
import Logo from '../../../../assets/logo.png';
import { ConditionButtons, LoginButtons, GenericButton } from '../GenericComponents';
import showPass from '../../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../../assets/icons/eyeopenpass.png';
import {useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import Firebase from 'firebase/app';
import axios from 'axios';
import { node_patient } from "../../../../config/endpoints";

const WelcomeAgain = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [vincular, setVincular] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const user = useSelector(state => state.user);
    const { currentUser } = useSelector((state) => state.userActive);
    const {method} = useParams();

    useEffect(() => {
        if(method) {
            setVincular(false);
        }
    }, [method])

    // TODO: Agregar la acción de linkear cuenta con email y password

    const linkAccountWithEmailAndPassword = () => {
        if(password !== confirmPassword) {
            console.error('Las contraseñas no coinciden');
            return false;
        }

        let code = user.email.split('@')[1].slice(0, 6)
        if (parseInt(user.email.split('@')[1].slice(0, 6)).length < 5) {
            code = user.ws_code
        }
        Firebase.auth()
            .signInWithEmailAndPassword(user.email, code)
            .then(async function (userCredential) {
                await userCredential.user.updateEmail(email)
                await userCredential.user.updatePassword(password)
                await userCredential.user.updateProfile({ displayName: user.ws })
                await currentUser.getIdToken().then(async token => {
                    let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                    let data = {
                        newValues: {
                            login: ['email'],
                            ws_code: code,
                            email: email || user.email,
                            password: password
                        }
                    }
                    await axios.patch(`${node_patient}/${user.dni}`, data, { headers })
                        .then(res => {
                            dispatch({ type: 'SET_USER_LOGIN', payload: ['email'] })
                            history.push('/')
                        })
                })
            })
            .catch(err => {
                console.log(err)
                if (err.message === "The email address is already in use by another account.") {
                    console.error("Esta cuenta ya está en uso", "Intenta con otro email o logueate con la cuenta ya existente", "warning")
                } else if (err.message === "User can only be linked to one identity for the given provider.") {
                    console.error("Ya tienes una cuenta de google vinculada", "No se puede vincular más de una cuenta del mismo sitio. Intenta con otro email.", "warning")
                } else if (err.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
                    console.error("No se pudo vincular esta cuenta", "Intenta con otro email", "warning")
                } else {
                    console.error("Ocurrió un error", err.message || err, "warning")
                }
                dispatch({ type: "LOADING", payload: false })
            })
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
            <LoginButtons vincular/>
            :
            <section className='login__mobile'> 
                {/* teléfono */}
                <form className='login__mobile__form'>
                    <label className='login__mobile__form--label'>Mail</label>
                    <input 
                        type='mail' 
                        className='login__mobile__form--input' 
                        placeholder='ejemplo@mail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <label className='login__mobile__form--label'>Contraseña</label>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        className='login__mobile__form--input' 
                        placeholder='password123'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src={showPassword ? eyeOpenPass : showPass } onClick={()=> setShowPassword(!showPassword)} className='login__mobile__form--img' alt='Eye closed'/>
                    {/* <img src={showPassword ? eyeOpenPass : showPass } className='login__mobile__form--img-confirm' alt='Eye closed'/> */}
                    
                    <ConditionButtons/>
                    
                    <label className='login__mobile__form--label'>Confirmar contraseña</label>
                    <input 
                        type='password' 
                        className='login__mobile__form--input' 
                        placeholder='Contraseña'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </form>
                <GenericButton color='blue' action={linkAccountWithEmailAndPassword}>Confirmar datos</GenericButton>
            </section>
            }
        </section>
    )
}

export default WelcomeAgain;
