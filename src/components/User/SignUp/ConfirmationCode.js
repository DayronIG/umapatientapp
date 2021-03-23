import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Stepper, GenericButton } from '../Login/GenericComponents';
import {node_patient} from '../../../config/endpoints';
import {useHistory} from 'react-router-dom';
import db from '../../../config/DBConnection';
import Confirm from '../../../assets/illustrations/ConfirmMail.png';
import Logo from '../../../assets/logo.png';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import Exclamation from '../../../assets/illustrations/exclamation.png';
import axios from 'axios';

const ConfirmationCode = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [code, setCode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const ws = useSelector(state => state.user.ws)

    const handleCheckUserCode = async (e) => {
        e.preventDefault();
        if (!code || code.length < 6) return false;

        try {
            const config = { headers: { 'Content-Type': 'application/json' } }
            let email, pass;
            await axios.get(`${node_patient}/validatePassword/${ws}/${code}`, {}, config)
                .then((res) => {
                    if (res.data.type !== "email") {
                        email = `${ws}@${code}.com`;
                        pass = code
                    }
                })
                .catch(() => {
                    setShowModal(true);
                    setModalMessage('Ha ocurrido un error. Por favor intente nuevamente.');
                })
            
            db.auth().signInWithEmailAndPassword(email, pass)
            .then(async (user) => {
                db.auth().currentUser.getIdToken().then(async token => {
                    let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                    let data = {
                        newValues: {
                            ws_code: pass,
                        }
                    }

                    let uid = db.auth().currentUser.uid;

                    await axios.patch(`${node_patient}/update/${uid}`, data, { headers })
                        .then(res => {
                            console.log(res);
                            history.push('/');
                        })
                        .catch(e => console.error(e));
                })
            })
            .catch(() => {
                setShowModal(true);
                setModalMessage('Ha ocurrido un error. Por favor intente nuevamente.');
            })
        } catch {
            setShowModal(true);
            setModalMessage('Ha ocurrido un error. Por favor intente nuevamente.');
        }
    }

    return (
        <section className='signUp'>
            <img className='signUp__logo' onClick={() => history.push('/')} src={Logo} alt="uma" />
            <section className='signUp__content'>
                <Stepper complete={4}/>
                <img src={Confirm} className='signUp__content--illustration' alt='Mailbox'/>
                <article className='signUp__content__mainText'>
                    <h1 className='title'>Ingresa el código de verificación</h1>
                    <p className='subtitle'>Ingresa el código que te hemos enviado por whatsapp.</p>
                </article>
                <form className='signUp__content__formGroup'>
                        <input
                            className='input-number' 
                            onChange={e => setCode(e.target.value)}
                            type='text'
                            inputMode='text'
                            minLength='6'
                            maxLength='6'
                            autoFocus
                            required
                            placeholder='123456'
                        />
                    <GenericButton action={e => handleCheckUserCode(e)}>
                        Confirmar
                    </GenericButton>
                </form>
            </section>
            {
                showModal &&
                <MobileModal hideCloseButton hideTitle>
                    <div className="modal_code_content">
                        <img src={Exclamation} className='modal__img' alt='Simbolo de exclamacion' />
                        <p className='modal__text'>{modalMessage}</p>
                        <div className='actionModal__btns'>
                            <button className='button-action log' onClick={() => {
                                dispatch({ type: 'RESET_USER_DATA' });
                                history.push('/');
                            }}>Continuar</button>
                        </div>
                    </div>
                </MobileModal>
            }
        </section>
    )
}

export default ConfirmationCode;
