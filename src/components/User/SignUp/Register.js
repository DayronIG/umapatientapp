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

const Register = () => {
    const {screen} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const userActive = useSelector(state => state.userActive)
    const [switchContent, setSwitchContent] = useState('1')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [dni, setDni] = useState('')
    const [healthinsurance, setHealthinsurance] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [sex, setSex] = useState('')
    const [errorDataRegister, setErrorDataRegister] = useState([])
    const [validations, setValidations] = useState([{
        email: false,
        password: false,
        passRepetition: false,
        firstname: false,
        lastname: false,
        dni: false,
        phone: false,
        dob: false,
        sex: false
    }])

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

    const handleCreateUser = async () => {
        if (validations.email && validations.passRepetition) {
            await Firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async user => {
                dispatch({ type: 'USER_PASSWORD', payload: '' });
                setSwitchContent('2');
            })
        } else {
            setErrorDataRegister([])
            if(!validations.email) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Email'])
            } if (!validations.password) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Contraseña'])
            } if(!validations.passRepetition) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Repetir contraseña'])
            }
        }
    }

    const updatePatient = async (uid, method) => {
        await Firebase.auth().currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
            let data = {
                newValues: {
                    login: [method],
                    email: email || '',
                    fullname: `${firstname} ${lastname}` || '',
                    dni: dni || '',
                    ws: phone || '',
                    sex: sex || '',
                    dob: birthDate || '',
                    healthinsurance: healthinsurance || ''
                }
            }
            await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                .then(res => {
                    dispatch({ type: 'SET_USER_LOGIN', payload: ['email'] })
                    dispatch({ type: 'USER_FIRST_WS', payload: phone })
                    dispatch({ type: 'USER_FIRST_FULLNAME', payload: `${firstname} ${lastname}` })
                    history.push('/signUp/congrats');
                })
        })
    }

    const validationForm = async () => {
        if( 
        validations.firstname
        && validations.lastname 
        && validations.dni
        && validations.phone
        && validations.dob
        && validations.sex
        ) {
            const uid = userActive.currentUser.uid;
            if(email && password) {
                await Firebase.auth().currentUser.sendEmailVerification()
                .then(async () => {
                    updatePatient(uid, 'email');
                })
                .catch(e => console.error(e))
            } else {
                const providerName = await Firebase.auth().currentUser.providerData[0].providerId;
                updatePatient(uid, providerName);
            }
        } else {
            setErrorDataRegister([])
            if(!validations.firstname) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Nombre'])
            } if(!validations.lastname) {
                setErrorDataRegister((errorDataRegister) =>[...errorDataRegister,'Apellido'])
            } if(!validations.dni) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Número de identidad'])
            } if(!validations.phone) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Teléfono'])
            } if(!validations.dob) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Fecha de nacimiento'])
            } if(!validations.sex) {
                setErrorDataRegister((errorDataRegister) => [...errorDataRegister,'Sexo'])
            }
        }
    }

    const handleInputsValidations = (e) => {
        switch (e.target.name) {
            case 'email':
                let validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
                if(validEmail) { 
                    setEmail(e.target.value)
                    setValidations({ ...validations, email: true })
                } else {
                    setValidations({ ...validations, email: false })
                }
            break;
            case 'pass':
                let validPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(e.target.value)
                if (validPass) {
                    setPassword(e.target.value)
                    setValidations({ ...validations, password: true })
                } else {
                    setPassword(e.target.value)
                    setValidations({ ...validations, password: false })
                }
            break;
            case 'passrepeat':
                if (e.target.value !== password) {
                    setValidations({ ...validations, passRepetition: false })
                } else {
                    setValidations({ ...validations, passRepetition: true })
                }
            break;
            case 'firstname':
                let validName = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
                if(validName) { 
                    setFirstName(e.target.value)
                    setValidations({ ...validations, firstname: true })
                } else {
                    setValidations({ ...validations, firstname: false})
                }
            break;
            case 'lastname':
                let validLastName = /^[^\s]{3,}( [^\s]+)?( [^\s]+)?( [^\s]+)?$/.test(e.target.value)
                if(validLastName) { 
                    setLastName(e.target.value)
                    setValidations({ ...validations, lastname: true })
                } else {
                    setValidations({ ...validations, lastname: false})
                }
            break;
            case 'phone':
                if (checkNum(e.target.value)) {
                    setPhone(e.target.value)
                    setValidations({ ...validations, phone: true })
                } else {
                    setValidations({ ...validations, phone: false})
                }
            break;
            case 'dni':
                if (e.target.value.length >= 7 && e.target.value.length <= 8) {
                    setDni(e.target.value)
                    setValidations({ ...validations, dni: true })
                } else {
                    setValidations({ ...validations, dni: false})
                }
            break;
            case 'healthinsurance':
                setHealthinsurance(e.target.value)
            break;
            default: return false;
        }
    }

    const handleDate = (e) => {
        const momentDate = moment(e).format('DD-MM-YYYY')
        const olderThan = moment().diff(e, 'years') 
        if(olderThan >= 16) {
            setBirthDate(momentDate)
            setValidations({...validations, dob: true})
        }else {
            setValidations({...validations, dob: false})
        }
    }

    const getSexValue = (e) => {
        if(e.target.value) {
            setSex(e.target.value)
            setValidations({ ...validations, sex: true })
        } else {
            setValidations({...validations, sex: false})
        }
    }

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
                        {errorDataRegister.length !== 0 && 
                        <>
                            <p className='invalid-field'>Por favor comprueba los datos ingresados en el campo: {errorDataRegister.join(', ')}</p>
                        </>
                        } 
                        <GenericInputs label='¿Cual es tu mail?' type='email' name='email' validate={(e) =>handleInputsValidations(e)} />
                        <GenericInputs label='Crea una contraseña' type='password' name='pass' validate={(e) =>handleInputsValidations(e)} />
                        <ConditionButtons check={password}/>
                        <GenericInputs label='Ingresa nuevamente tu contraseña' type='password' name='passrepeat' validate={(e) =>handleInputsValidations(e)}/>
                    </>
                    }
                    {switchContent === '2' &&
                    <>
                        {errorDataRegister.length !== 0 && 
                            <p className='invalid-field'>Por favor comprueba los datos ingresados en el campo: {errorDataRegister.join(', ')}</p>
                        } 
                        <GenericInputs
                            label='¿Cual es tu nombre?'
                            type='text' name='firstname' 
                            validate={(e) =>handleInputsValidations(e)}
                        />
                        <GenericInputs 
                            label='¿Cual es tu apellido?' 
                            type='text' 
                            name='lastname' 
                            validate={(e) =>handleInputsValidations(e)}
                        />
                        <GenericInputs label='Ingresa tu número de identidad' type='number' name='dni' validate={(e) =>handleInputsValidations(e)} />
                        <GenericInputs label='Ingresa tu numero de celular' type='number' name='phone' validate={(e) =>handleInputsValidations(e)}/>
                        <GenericInputs label='¿Cual es tu cobertura de salud?' type='text' name='healthinsurance' validate={(e) =>handleInputsValidations(e)}/>
                        <SelectOption select action={(e) => getSexValue(e)}/>
                        <SelectOption calendar action={(e)=>handleDate(e)}/>
                        {errorDataRegister.map(item => item === 'Fecha de nacimiento' && <p className='invalid-field date'>Debes ser mayor de 16 años para poder utilizar la aplicación</p>)}
                    </> 
                    }
                </form>
                <section className='signUp__actions'>
                    {switchContent === '1' &&
                    <>
                        <button className='signUp__actions--button back' onClick={()=> history.push('/signup')}>Atras</button>
                        <button className='signUp__actions--button foward' onClick={handleCreateUser}>Siguiente</button>
                    </>
                    }
                    {switchContent === '2' && 
                    <>
                        <GenericButton color='blue' action={validationForm}>Registrarme</GenericButton>
                        <p className='terms-and-conditions'>Al registrarte estás aceptando los <a onClick={()=>history.push('/termsconditions')}>términos y condiciones</a></p>
                    </>
                    }
                </section>
            </section>
        </section>
    )
} 

export default Register;
