import React, {useState, useEffect} from 'react';
import Logo from '../../../assets/logo.png';
import { ConditionButtons, GenericInputs, TextAndLink, Stepper, GenericButton, SelectOption } from '../Login/GenericComponents';
import { useHistory, useParams } from 'react-router-dom';
import '../../../styles/user/signUp/signUp.scss';

const Registrer = () => {
    const {screen} = useParams();
    const history = useHistory();
    const [switchContent, setSwitchContent] = useState('1')

    useEffect(() => {
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
                        <GenericInputs label='¿Cual es tu mail?' type='email' />
                        <ConditionButtons/>
                        <GenericInputs label='Crea una contraseña' type='password' />
                    </>
                    }
                    {switchContent === '2' &&
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
                    {switchContent === '1' &&
                    <>
                        <button className='signUp__actions--button back'>Atras</button>
                        <button className='signUp__actions--button foward' onClick={()=> setSwitchContent('2')}>Siguiente</button>
                    </>
                    }
                    {switchContent === '2' && 
                        <>
                        <GenericButton color='blue'>Registrarme</GenericButton>
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
