import React, { useState, useCallback } from 'react';
import '../../../styles/login/genericComponents.scss';
import showPass from '../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../assets/icons/eyeopenpass.png';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Apple from '../../../assets/logos/ios.png';
import Mobile from '../../../assets/logos/mobile.png';
import Email from '../../../assets/logos/email.png';

export const GenericInputs = (props) => {
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

    return (
        <form className='form'>
            <input 
            type={props.Password ? showPassword ? 'text' : 'password' : 'text'}
            className='form--input' 
            onChange={(e) => _validateForm(e)}
            />
            <label className='form--label'>
                 {props.label}
            </label>
            {props.Password ? 
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

export const GenericButton = ({color, children}) => {
    return (
        <button className={color == 'blue'? 'action-btn' : 'action-btn white'}>{children}</button>
    )
};

export const LoginButtons = (props) => {
    return (
        <section className={props.circleBtn ? 'login__buttonGroup' : 'login__buttonGroup column'}>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Google} alt='Google logo'/>
                { props.circleBtn ? null : <p>Ingresar con Google</p> }
            </button> 
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Microsoft} alt='Microsoft logo'/>
                { props.circleBtn ? null : <p>Ingresar con Microsoft</p> }
            </button>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }>
                <img src={Apple} alt='Apple logo'/>
                { props.circleBtn ? null : <p>Ingresar con Apple</p> }
            </button>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }>
                <img src={props.circleBtn ? Mobile : Email} alt='Mobile image'/>
                { props.circleBtn ? null : <p>Ingresar con otra cuenta</p> }
            </button>
        </section>
    )
};
