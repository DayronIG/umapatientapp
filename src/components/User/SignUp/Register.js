import React, {useState} from 'react';
// import { Calendar } from 'react-big-calendar';
import '../../../styles/user/signUp/signUp.scss';
import Logo from '../../../assets/logo.png';
import { ConditionButtons, GenericInputs, TextAndLink, Stepper, GenericButton, SelectOption } from '../Login/GenericComponents';

const Registrer = () => {
    // const [switchContent, setSwitchContent] = useState('')
    const [switchContent, setSwitchContent] = useState('register')

    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                <Stepper/>
                <article className='signUp__content__mainText'>
                    <h1 className='title'>¡Te damos la bienvenida a ÜMA!</h1>
                    {switchContent === 'register' && 
                    <p className='subtitle'>Para crear tu cuenta, primero necesitamos que nos indiques un mail y una contraseña</p>
                    }
                    {switchContent === 'form' && 
                    <p className='subtitle'>Ahora, necesitamos saber un poco más de vos</p> 
                    }
                </article>
                <form className='signUp__content__form'>
                    {switchContent === 'register' && 
                    <>
                        <GenericInputs label='¿Cual es tu mail?' type='email' />
                        <ConditionButtons/>
                        <GenericInputs label='Crea una contraseña' type='password' />
                    </>
                    }
                    {switchContent === 'form' &&
                    <>
                        <GenericInputs label='¿Cual es tu nombre?' type='text' />
                        <GenericInputs label='¿Cual es tu apellido?' type='text' />
                        <GenericInputs label='Ingresa tu numero de identidad' type='number' />
                        <GenericInputs label='Ingresa tu numero de celular' type='number' />
                        <GenericInputs label='¿Cual es tu cobertura de salud?' type='text' />
                        <SelectOption calendar/>
                        <SelectOption select/>
                    </> 
                    }
                </form>
                <section className='signUp__actions'>
                    {switchContent === 'register' &&
                    <>
                        <button className='signUp__actions--button back'>Atras</button>
                        <button className='signUp__actions--button foward' onClick={()=> setSwitchContent('form')}>Siguiente</button>
                    </>
                    }
                    {switchContent === 'form' && 
                        <>
                        <GenericButton color='blue'>Registrarme</GenericButton>
                        <p className='terms-and-conditions'>Al registrarte estás aceptando los <a href='#'>términos y condiciones</a></p>
                        {/* <Calendar/> */}
                        </>
                        
                    }
                </section>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa'/>
            </section>
        </section>
    )
} 

export default Registrer;
