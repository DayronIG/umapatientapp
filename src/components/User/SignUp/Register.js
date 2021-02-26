import React, {useState, useEffect} from 'react';
import Logo from '../../../assets/logo.png';
import {useSelector, useDispatch} from 'react-redux';
import { ConditionButtons, GenericInputs, TextAndLink, Stepper, GenericButton, SelectOption } from '../Login/GenericComponents';
import { useHistory, useParams } from 'react-router-dom';
import Firebase from 'firebase/app';
import axios from 'axios';
import {node_patient} from '../../../config/endpoints';
import '../../../styles/user/signUp/signUp.scss';

const Registrer = () => {
    const {screen} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const [switchContent, setSwitchContent] = useState('1')
    const userData = useSelector(state => state.user)
    const userActive = useSelector(state => state.userActive)

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
        if (userData.email !== '' && userData.password !== '') {
            await Firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
            .then(async user => {
                dispatch({ type: 'USER_PASSWORD', payload: '' });
                setSwitchContent('2');
            })
        }
    }

    const updatePatient = async (uid, method) => {
        await Firebase.auth().currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
            let data = {
                newValues: {
                    login: [method],
                    email: userData.email || '',
                    fullname: `${userData.firstname} ${userData.lastname}` || '',
                    dni: userData.dni || '',
                    ws: userData.phone || '',
                    sex: userData.sex || '',
                    dob: userData.dob || '',
                }
            }
            await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                .then(res => {
                    dispatch({ type: 'SET_USER_LOGIN', payload: ['email'] })
                    dispatch({ type: 'USER_FIRST_WS', payload: userData.phone })
                    dispatch({ type: 'USER_FIRST_FULLNAME', payload: `${userData.firstname} ${userData.lastname}` })
                    history.push('/signUp/congrats');
                })
        })
    }

    const validationForm = async () => {
        if( 
        userData.firstname !== '' 
        && userData.lastname !== '' 
        && userData.dni !== ''
        && userData.phone !== ''
        && userData.dob !== ''
        && userData.sex !== ''
        ) {
            const uid = userActive.currentUser.uid;

            if(userData.email && userData.password) {
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
            console.log('Agregar errores en los inputs');
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
                        <GenericInputs label='¿Cual es tu mail?' type='email' name='email' />
                        <ConditionButtons/>
                        <GenericInputs label='Crea una contraseña' type='password' name='pass' />
                    </>
                    }
                    {switchContent === '2' &&
                    <>
                        <GenericInputs label='¿Cual es tu nombre?' type='text' name='firstname' />
                        <GenericInputs label='¿Cual es tu apellido?' type='text' name='lastname' />
                        <GenericInputs label='Ingresa tu numero de identidad' type='number' name='dni' />
                        <GenericInputs label='Ingresa tu numero de celular' type='number' name='phone'/>
                        <GenericInputs label='¿Cual es tu cobertura de salud?' type='text' name='healthinsurance'/>
                        <SelectOption calendar/>
                        <SelectOption select/>
                    </> 
                    }
                </form>
                <section className='signUp__actions'>
                    {switchContent === '1' &&
                    <>
                        <button className='signUp__actions--button back'>Atras</button>
                        <button className='signUp__actions--button foward' onClick={handleCreateUser}>Siguiente</button>
                    </>
                    }
                    {switchContent === '2' && 
                        <>
                        <GenericButton color='blue' action={validationForm}>Registrarme</GenericButton>
                        <p className='terms-and-conditions'>Al registrarte estás aceptando los <a href='#'>términos y condiciones</a></p>
                        </>
                        
                    }
                </section>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa'/>
            </section>
        </section>
    )
} 

export default Registrer;
