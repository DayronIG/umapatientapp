import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { GenericButton } from '../Login/GenericComponents';
import { useDispatch, useSelector } from 'react-redux';
import Exclamation from '../../../assets/illustrations/exclamation.png';
import '../../../styles/user/signUp/signUp.scss';

const AlreadyExists = () =>  {
    const history = useHistory()
    const dispatch = useDispatch()
    // const [hiddenEmail, setHiddenEmail] = useState('')
    // const user = useSelector(state => state.userActive?.currentUser);
    const {method} = useParams();

    // const hideEmail = (user) => {
    //     if(!user.email) return false;
    //     const userHidde = user.email
    //     const emailToShow = userHidde.split('@')[0].slice(0, 2)
    //     const emailToHide = userHidde.split('@')[0].slice(2).replace(/./g, '*')
    //     const domain = `@${userHidde.split('@')[1]}`
    //     setHiddenEmail(`${emailToShow}${emailToHide}${domain}`)
    // }
    
    // useEffect(() => {
    //     if(user) {
    //         hideEmail(user)
    //     }
    // }, [user])

    const handleSignIn = () => {
        history.push('/')
    }

    return (
        <section className='signUp'>
            <section className='signUp__content'>
                <img src={Exclamation} alt='exclamation mark' className='signUp__content--illustration exclamation' />
                <section className='signUp__content__mainText'>
                    <h1 className='title exists'>Este mail se encuentra en uso</h1>
                    {
                        method ?
                            <p className='subtitle'>Ya existe un usuario registrado con el  método <strong>{method === 'password' ? 'mail y contraseña' : method}</strong></p> :
                            <p className='subtitle'>Ya existe un usuario registrado con el mail seleccionado</p>
                    }
                    {/* {
                        user?.email ? 
                        <p className='subtitle'>Ya existe un usuario registrado con el mail {hiddenEmail}</p> :
                        <p className='subtitle'>Ya existe un usuario registrado con el mail seleccionado</p>
                    } */}
                    <p className='subtitle'>¿Deseas ingresar?</p>
                </section>
                <section>
                    <GenericButton action={handleSignIn} >
                        Ingresar
                    </GenericButton>
                    <GenericButton action={()=> history.push('/signup')}>
                        Registrar otro mail
                    </GenericButton>
                </section>
            </section>
        </section>
    )
}

export default AlreadyExists;
