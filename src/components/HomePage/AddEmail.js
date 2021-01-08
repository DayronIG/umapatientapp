import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import Firebase from 'firebase/app';
import { GoogleButton, MicrosoftButton, EmailButton } from '../User/LoginButtons';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import '../../styles/home/addemail.scss';


const EmailForm = (props) => {
    const dispatch = useDispatch()
    const [password, setPassword] = useState("")
    const [passValidation, setPassValidation] = useState({ validPass: true, validRepetition: true })

    const _validateForm = useCallback((e) => {
        if (e.target.name === "email") {
            // validar email
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

    return <div className="addEmail__container">
        <div className="addEmail__title">Necesitamos que completes algunos datos</div>
        <div className="addEmail__text">
            Tienes tiempo hasta el 31 de Enero para completar tus datos.
        </div>
        <form className="addEmail__form" autoComplete="off">
            <label htmlFor="email" className="addEmail__label">Email*</label>
            <input
                type="email"
                name="email"
                placeholder="ejemplo@mail.com"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopaasdasde"
            ></input>
            <label htmlFor="pass" className="addEmail__label">Contraseña*</label>
            <input
                type="password"
                name="pass"
                placeholder="contraseña"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopes"
            ></input>
            {passValidation.validPass ? <div className="addEmail__success">
                <IoIosCheckmarkCircleOutline />
                <span>Alta contraseña</span>
            </div> :
                <div className="addEmail__warning">
                    <MdRadioButtonUnchecked />
                    <span>Mínimo 6 caracteres</span>
                </div>}
            <label htmlFor="passrepeat" className="addEmail__label">Confirmar contraseña</label>
            <input
                type="password"
                name="passrepeat"
                placeholder="contraseña"
                className="addEmail__input"
                onChange={(e) => _validateForm(e)}
                autoComplete="nopes"
            ></input>
            {passValidation.validRepetition ? <div className="addEmail__success">
                <IoIosCheckmarkCircleOutline />
                <span>Perfecto</span>
            </div> :
                <div className="addEmail__warning">
                    <MdRadioButtonUnchecked />
                    <span>Las contraseñas no coinciden</span>
                </div>
            }
        </form>
        <div className="addEmail__actions">
            <button onClick={() => console.log('email')} className="btn btn-lg-blue">Confirmar</button>
            <span className="addEmail__actionSkip" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Ahora no</span>
        </div>
    </div>
}


const Advice = ({setAdvice}) => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.userActive)
    const linkAccount = () => {
        console.log(currentUser)
        var googleProvider = new Firebase.auth.GoogleAuthProvider();

        currentUser.linkWithPopup(googleProvider).then(function (result) {
            // Accounts successfully linked.
            var credential = result.credential;
            var user = result.user;
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            // ...
        });
    }
    return <div className="addEmail__container">
        <div className="addEmail__title">¡Tenemos novedades!</div>
        <div className="addEmail__text">
            A partir de febrero vas a tener una <b>nueva forma de ingresar</b> a ÜMA. <br />
            Solo tienes que <b>vincular tu cuenta</b> con el email que usarás para ingresar.
        </div>
        <div className="addEmail__action">
            <GoogleButton buttonText="Vincular con Google" action={() => linkAccount(false)}></GoogleButton>
            <MicrosoftButton buttonText="Vincular con Microsoft" action={() => linkAccount(false)}></MicrosoftButton>
            <EmailButton buttonText="Vincular con Email" action={() => setAdvice(false)}></EmailButton>
            <span className="addEmail__actionSkip" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Ahora no</span>
        </div>
    </div>
}


const AddEmail = (props) => {
    const dispatch = useDispatch()
    const [showAdvice, setAdvice] = useState(true)


    return (
        <MobileModal hideCloseButton={true} callback={() => dispatch({ type: 'CLOSE_MODAL' })}>
            {showAdvice ? <Advice setAdvice={setAdvice}/> : <EmailForm {...props}/>}
        </MobileModal>)
}

export default AddEmail