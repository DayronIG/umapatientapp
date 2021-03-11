import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GenericButton } from '../Login/GenericComponents';
// import Firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import db from '../../../config/DBConnection';
import Exclamation from '../../../assets/illustrations/exclamation.png';
import '../../../styles/user/signUp/signUp.scss';

const AlreadyExists = () =>  {
    const history = useHistory()
    const dispatch = useDispatch()
    // const [hiddenEmail, setHiddenEmail] = useState('')

    // const hideEmail = (email) => {
    //     const emailToShow = email.split('@')[0].slice(0, 4);
    //     const emailToHide = email.split('@')[0].slice(4).replace(/./g, '*');
    //     const domain = `@${email.split('@')[1]}`;

    //     setHiddenEmail(`${emailToShow}${emailToHide}${domain}`)
    // };

    const handleSignIn = () => {
        const user = db.auth().currentUser;
        user.delete().then(user => {
            dispatch({type: 'RESET_USER_DATA'})
            history.push('/')
        }).catch(e => {
            console.error(e)
        });
    }

    return (
        <section className='signUp'>
            <section className='signUp__content'>
                <img src={Exclamation} alt='exclamation mark' className='signUp__content--illustration exclamation' />
                <section className='signUp__content__mainText'>
                    <h1 className='title exists'>Este mail se encuentra en uso</h1>
                    <p className='subtitle'>Ya existe un usuario registrado con el mail ingresado. </p>
                    <p className='subtitle'>¿Deseas ingresar?</p>
                </section>
                <section>
                    <GenericButton action={handleSignIn} >
                        Ingresar
                    </GenericButton>
                    <GenericButton action={()=> history.push('/signup/form/2')}>
                        Continuar registro
                    </GenericButton>
                </section>
            </section>
        </section>
    )
}

export default AlreadyExists;
