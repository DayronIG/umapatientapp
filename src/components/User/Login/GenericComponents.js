import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const GenericInputs = ({label, type}) => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)    
    const [passValidation, setPassValidation] = useState({ validPass: false, validRepetition: false })
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [selectSwitch, setSelectSwitch] = useState(false)
    const [labelUp, setLabelUp] = useState(false)

    const _validateForm = useCallback((e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value)
            let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
            if(valid) { 
                setValidEmail(true)
            } else {
                setValidEmail(false)
            }
        } else if (e.target.name === 'pass') {
            setPassword(e.target.value)
            if (e.target.value.length < 6) {
                setPassValidation({ ...passValidation, validPass: false })
            } else {
                setPassValidation({ ...passValidation, validPass: true })
            }
        } else if (e.target.name === 'passrepeat') {
            if (e.target.value !== password) {
                setPassValidation({ ...passValidation, validRepetition: false })
            } else {
                setPassValidation({ ...passValidation, validRepetition: true })
            }
        }
    }, [passValidation, password])

    return (
        <div className='form'>
            <input 
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
            />
            :
            null
            }
        </div>
    )
};

export const SelectOption = ({calendar, select}) => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [date, setDate] = useState(moment()
    .tz('America/Argentina/Buenos_Aires')
    .format());
    const [loading, setLoading] = useState(true);
    const [filterDt, setFilterDt] = useState('');
    const [calendarAppoints, setCalendarAppoints] = useState([]);
    const localizer = momentLocalizer(moment);
    const dt_calendar = date;
    const yearMonth = moment(date).format('YYYYMM');

    return (
        <>
        {showCalendar && 
        <section className='calendar__container'>
            <Calendar
                localizer={localizer}
                onNavigate={(dateNav, view) => {
                    const year = moment(date).format('YYYY');
                    const month = moment(date)
                    .format('MM');
                    const day = moment(dateNav).format('DD');
                    setFilterDt(`${year}-${month}-${day}`);
                    
                }}
                events={calendarAppoints}
                defaultView='month'
                style={{ height: '80vh' }}
                // components={{ toolbar: newToolbar }}
                // dayPropGetter={customDaysPropGetter}
                date={new Date(dt_calendar)}
                startAccessor='start'
                endAccessor='end'
            />
        </section>
        }
        {calendar &&  
        <section className='birth__date'>
            <p className='text'>Selecciona tu fecha de nacimiento</p>
            <img src={CalendarIcon} alt='Icono de calendario' className='icon--calendar' onClick={() => setShowCalendar(!showCalendar)}/>
        </section>}
        {select && 
        <div className='container__select--sex'>
            <select className='select--sex' required >
                <option selected disabled>Indica tu sexo</option>
                <option value='femenino'>Femenino</option>
                <option value='masculino'>Masculino</option>
                <option value='otro'>Otro</option>
            </select>
            {/* <ul className="select--sex">
                <p className='select--sex-default'>Selecciona tu sexo</p>
                <ul className='options open'>
                    <li>Femenino</li>
                    <li>Masculino</li>
                    <li>Otro</li>
                </ul>
            </ul> */}
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

export const GenericButton = ({color, children}) => {
    //Aciones de rutas
    return (
        <button className={color == 'blue'? 'action-btn' : 'action-btn white'}>{children}</button>
    )
};

export const LoginButtons = ({circleBtn, signUp, vincular}) => {
    return (
        <section className={circleBtn ? 'login__buttonGroup' : 'login__buttonGroup column'}>
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
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
            <button className={circleBtn ? 'login__button' : 'login__button large' }>
                <img src={circleBtn ? Mobile : Email} alt='Mobile image'/>
                { circleBtn ? null : signUp ? <p>Registrarme con otra cuenta</p> : <p>{vincular ? 'Vincular' : 'Ingresar'} con otra cuenta</p>  }
            </button> 
        </section>
    )
};

export const TextAndLink = ({text, link}) => {
    // Cambian las rutas registrarme / ingresar / enviar por otro medio
    return(
        <section className='textAndLink'>
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
