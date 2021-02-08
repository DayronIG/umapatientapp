import React, { useState, useCallback } from 'react';
import showPass from '../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../assets/icons/eyeopenpass.png';
import '../../../styles/login/genericComponents.scss';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Apple from '../../../assets/logos/ios.png';
import Mobile from '../../../assets/logos/mobile.png';

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
                className='form--input' 
                onChange={(e) => _validateForm(e)}
            />
            <label className='form--label'>
                 {props.label}
            </label>
            {props.passwordEye ? 
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
        <section className='login__buttonGroup'>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }><img src={Google} alt='Google logo'/></button> 
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }><img src={Microsoft} alt='Microsoft logo'/></button>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }><img src={Apple} alt='Apple logo'/></button>
            <button className={props.circleBtn ? 'login__button' : 'login__button large' }><img src={Mobile} alt='Mobile image'/></button>
        </section>
    )
}
