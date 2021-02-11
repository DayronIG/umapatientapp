import React, { useState, useCallback } from 'react';
import '../../../styles/user/genericComponents.scss';
import showPass from '../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../assets/icons/eyeopenpass.png';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Apple from '../../../assets/logos/ios.png';
import Mobile from '../../../assets/logos/mobile.png';
import Email from '../../../assets/logos/email.png';

export const GenericInputs = ({label, type}) => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)    
    const [passValidation, setPassValidation] = useState({ validPass: false, validRepetition: false })
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

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

    {console.log('esto es el mail', email)}

    return (
        <form className='form'>
            <input 
            // type={Password ? showPassword ? 'text' : 'password' : 'text'}
            type={showPassword ? 'text' : type}
            className='form--input' 
            // name={Password ? 'pass' : 'email'}
            onChange={(e) => _validateForm(e)}
            />
            <label className='form--label'>
                {label}
            </label>
            {type === 'password' ? 
            <img 
            src={showPassword ? eyeOpenPass : showPass} 
            alt="password" 
            onClick={() => 
            setShowPassword(!showPassword)} 
            className='form--eyePass'
            />
            :
            null}
        </form>
    )
};

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

export const GenericButton = ({color, children}) => {
    return (
        <button className={color == 'blue'? 'action-btn' : 'action-btn white'}>{children}</button>
    )
};

export const LoginButtons = ({circleBtn}) => {
    return (
        <section className={circleBtn ? 'login__buttonGroup' : 'login__buttonGroup column'}>
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Google} alt='Google logo'/>
                { circleBtn ? null : <p>Ingresar con Google</p> }
            </button> 
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Microsoft} alt='Microsoft logo'/>
                { circleBtn ? null : <p>Ingresar con Microsoft</p> }
            </button>
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Apple} alt='Apple logo'/>
                { circleBtn ? null : <p>Ingresar con Apple</p> }
            </button>
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={circleBtn ? Mobile : Email} alt='Mobile image'/>
                { circleBtn ? null : <p>Ingresar con otra cuenta</p> }
            </button>
        </section>
    )
};

export const TextAndLink = ({text, link}) => {
    // Cambian las rutas registrarme / ingresar
    return(
        <section className='textAndLink'>
            <p>{text}</p>
            <a href='#'>{link}</a>
        </section>
    )
}

export const Stepper = () => {
    return(
        <ul class="stepper">
            <li class="step complete"></li>
            <li class="step circle"></li>
            <li class="step"></li>
            <li class="step"></li>
        </ul>
    )
}
