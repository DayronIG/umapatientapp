import React, {useState, useEffect} from 'react';
import Logo from '../../../assets/logo.png';
import {checkNum} from '../../Utils/stringUtils';
import {useSelector, useDispatch} from 'react-redux';
import { ConditionButtons, GenericInputs, TextAndLink, Stepper, GenericButton, SelectOption } from '../Login/GenericComponents';
import { useHistory, useParams } from 'react-router-dom';
import Firebase from 'firebase/app';
import axios from 'axios';
import moment from 'moment-timezone';
import {node_patient} from '../../../config/endpoints';
import '../../../styles/user/signUp/signUp.scss';
import { useForm } from "react-hook-form";

const Register = () => {
    const {screen} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const { register, handleSubmit, errors } = useForm();
    const userActive = useSelector(state => state.userActive)
    const [switchContent, setSwitchContent] = useState('1')
    const [password, setPassword] = useState('')
    const [healthinsurance, setHealthinsurance] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [sex, setSex] = useState('')
    // const [email, setEmail] = useState('')
    // const [firstname, setFirstName] = useState('')
    // const [lastname, setLastName] = useState('')
    // const [phone, setPhone] = useState('')
    // const [dni, setDni] = useState('')
    // const [errorDataRegister, setErrorDataRegister] = useState([])
    // const [validations, setValidations] = useState([{
    //     email: false,
    //     password: false,
    //     passRepetition: false,
    //     firstname: false,
    //     lastname: false,
    //     dni: false,
    //     phone: false,
    //     dob: false,
    //     sex: false
    // }])


    useEffect (()=> {
        if (screen) {
            switch(screen) {
                case '1': setSwitchContent('1')
                break;
                case '2': setSwitchContent('2');
                break;
                default: history.push('/');
            }
        }
    }, [screen])

    const handleCreateUser = async (data) => {
        await Firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(async user => {
            dispatch({ type: 'USER_PASSWORD', payload: '' });
            setSwitchContent('2');
        })
    }

    const updatePatient = async (uid, method, dataVal) => {
        await Firebase.auth().currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
            let data = {
                newValues: {
                    login: [method],
                    email: dataVal.email || '',
                    fullname: `${dataVal.firstname} ${dataVal.lastname}` || '',
                    dni: dataVal.dni || '',
                    ws: dataVal.phone || '',
                    sex: sex || '',
                    dob: birthDate || '',
                    healthinsurance: healthinsurance || ''
                }
            }
            await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                .then(res => {
                    dispatch({ type: 'SET_USER_LOGIN', payload: ['email'] })
                    dispatch({ type: 'USER_FIRST_WS', payload: dataVal.phone })
                    dispatch({ type: 'USER_FIRST_FULLNAME', payload: `${dataVal.firstname} ${dataVal.lastname}` })
                    history.push('/signUp/congrats');
                })
        })
    }

    const validationForm = async (dataVal) => {
        const uid = userActive.currentUser.uid;
        if(dataVal.email && dataVal.password) {
            await Firebase.auth().currentUser.sendEmailVerification()
            .then(async () => {
                updatePatient(uid, 'email', dataVal);
            })
            .catch(e => console.error(e))
        } else {
            const providerName = await Firebase.auth().currentUser.providerData[0].providerId;
            updatePatient(uid, providerName, dataVal);
        }
    }

    // const handleInputsValidations = (e) => {
    //     switch (e.target.name) {
    //         case 'email':
    //             let validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
    //             if(validEmail) { 
    //                 setEmail(e.target.value)
    //                 setValidations({ ...validations, email: true })
    //             } else {
    //                 setValidations({ ...validations, email: false })
    //             }
    //         break;
    //         case 'pass':
    //             let validPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(e.target.value)
    //             if (validPass) {
    //                 setPassword(e.target.value)
    //                 setValidations({ ...validations, password: true })
    //             } else {
    //                 setPassword(e.target.value)
    //                 setValidations({ ...validations, password: false })
    //             }
    //         break;
    //         case 'passrepeat':
    //             if (e.target.value !== password) {
    //                 setValidations({ ...validations, passRepetition: false })
    //             } else {
    //                 setValidations({ ...validations, passRepetition: true })
    //             }
    //         break;
    //         case 'firstname':
    //             let validName = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
    //             if(validName) { 
    //                 setFirstName(e.target.value)
    //                 setValidations({ ...validations, firstname: true })
    //             } else {
    //                 setValidations({ ...validations, firstname: false})
    //             }
    //         break;
    //         case 'lastname':
    //             let validLastName = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
    //             if(validLastName) { 
    //                 setLastName(e.target.value)
    //                 setValidations({ ...validations, lastname: true })
    //             } else {
    //                 setValidations({ ...validations, lastname: false})
    //             }
    //         break;
    //         case 'phone':
                // if (checkNum(e.target.value)) {
                //     setPhone(e.target.value)
                //     setValidations({ ...validations, phone: true })
                // } else {
                //     setValidations({ ...validations, phone: false})
                // }
    //         break;
    //         case 'dni':
    //             if (e.target.value.length >= 7 && e.target.value.length <= 8) {
    //                 setDni(e.target.value)
    //                 setValidations({ ...validations, dni: true })
    //             } else {
    //                 setValidations({ ...validations, dni: false})
    //             }
    //         break;
    //         case 'healthinsurance':
    //             setHealthinsurance(e.target.value)
    //         break;
    //         default: return false;
    //     }
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

    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                {
                    switchContent === '1' && <Stepper complete={1}/>
                }
                {
                    switchContent === '2' && <Stepper complete={2}/>
                }
                <article className='signUp__content__mainText'>
                    <h1 className='title'>¡Te damos la bienvenida a ÜMA!</h1>
                    {switchContent === '1' && 
                    <p className='subtitle'>Para crear tu cuenta, primero necesitamos que nos indiques un mail y una contraseña</p>
                    }
                    {switchContent === '2' && 
                    <p className='subtitle'>Ahora, necesitamos saber un poco más de vos</p> 
                    }
                </article>
                <form className='signUp__content__form'>
                    {switchContent === '1' && 
                    <>
                        <GenericInputs 
                            label='¿Cual es tu mail?' 
                            type='email' 
                            name='email'
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                                    }
                                )
                            }
                        />
                        {errors.email && errors.email.type === "required" && <span>Campo obligatorio</span>}
                        {errors.email && errors.email.type === "pattern" && <span>Ingrese un mail válido</span>}
                        <GenericInputs 
                            label='Crea una contraseña' 
                            type='password' 
                            name='password'
                            action={(e)=> setPassword(e.target.value)}
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
                                    }
                                )
                            }
                        />
                        {errors.password && errors.password.type === "required" && <span>Campo obligatorio</span>}
                        {errors.password && errors.password.type === "pattern" && <span>La contraseña debe tener un minimo de 8 caracteres y al menos un número</span>}
                        <ConditionButtons check={password}/>
                        <GenericInputs 
                            label='Ingresa nuevamente tu contraseña' 
                            type='password' 
                            name='passrepeat' 
                            inputRef={
                                register(
                                    { 
                                        validate: value => value === password || 'Las contraseñas no coinciden'
                                    }
                                )
                            }
                        />
                        {errors.passrepeat && <p>{errors.passrepeat.message}</p>}
                    </>
                    }
                    {switchContent === '2' &&
                    <>
                        <GenericInputs
                            label='¿Cual es tu nombre?'
                            type='text' name='firstname' 
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        pattern: /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/ 
                                    }
                                )
                            }
                        />
                        {errors.firstname && errors.firstname.type === "required" && <span>Campo obligatorio</span>}
                        {errors.firstname && errors.firstname.type === "pattern" && <span>El formato no es válido</span>}
                        <GenericInputs 
                            label='¿Cual es tu apellido?' 
                            type='text' 
                            name='lastname' 
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        pattern: /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/ 
                                    }
                                )
                            }
                        />
                        {errors.lastname && errors.lastname.type === "required" && <span>Campo obligatorio</span>}
                        {errors.lastname && errors.lastname.type === "pattern" && <span>El formato no es válido</span>}
                        <GenericInputs
                            label='Ingresa tu número de identidad' 
                            type='number' 
                            name='dni' 
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        minLength: 7
                                    }
                                )
                            } 
                        />
                        {errors.dni && errors.dni.type === "required" && <span>Campo obligatorio</span>}
                        {errors.dni && errors.dni.type === "minLength" && <span>El numero de identificacion debe tener al menos 7 números</span>}
                        <GenericInputs
                            label='Ingresa tu numero de celular'
                            type='number' 
                            name='phone'
                            inputRef={
                                register(
                                    { 
                                        required: true, 
                                        minLength: 10
                                    }
                                )
                            } 
                        /> 
                        {errors.phone && errors.phone.type === "required" && <span>Campo obligatorio</span>}
                        {errors.phone && errors.phone.type === "minLength" && <span>El número de teléfono debe tener al menos 10 números</span>}
                        <GenericInputs 
                            label='¿Cual es tu cobertura de salud?' 
                            type='text' 
                            name='healthinsurance'
                            action={(e)=> setHealthinsurance(e)}
                        />

                        <SelectOption 
                            select                          
                            action={(e)=>setSex(e)}
                        />
                        {/* {errors.sex && errors.sex.type === "required" && <span>Por favor indique su sexo</span>} */}
                        <SelectOption 
                            calendar
                            action={(e)=>setBirthDate(e)}
                        /> 
                    </> 
                    }
                </form>
                <section className='signUp__actions'>
                    {switchContent === '1' &&
                    <>
                        <button className='signUp__actions--button back' onClick={()=> history.push('/signup')}>Atras</button>
                        <button className='signUp__actions--button foward' onClick={handleSubmit(handleCreateUser)}>Siguiente</button>
                    </>
                    }
                    {switchContent === '2' && 
                    <>
                        <GenericButton color='blue' action={handleSubmit(validationForm)}>Registrarme</GenericButton>
                        <p className='terms-and-conditions'>Al registrarte estás aceptando los <a onClick={()=>history.push('/termsconditions')}>términos y condiciones</a></p>
                    </>
                    }
                </section>
            </section>
        </section>
    )
} 

export default Register;
