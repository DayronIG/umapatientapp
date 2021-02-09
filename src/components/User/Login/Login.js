import React from 'react';
// import { Link } from 'react-router-dom';
import '../../../styles/login/login.scss';
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import {GenericInputs, GenericButton, LoginButtons} from './GenericComponents';
import Logo from '../../../assets/logo.png';

const Login = () =>  {

    // const _submitForm = useCallback(async (e) => {
    //     if(!passValidation.validPass || !passValidation.validRepetition || !validEmail) {
    //         swal("Revisa los datos", "Por favor, revisa los datos introducidos", "warning")
    //         return ""
    //     }
    //     dispatch({type: "LOADING", payload: true})
    //     // var credential = Firebase.auth.EmailAuthProvider.credential(email, password)
    //     // var provider = await new Firebase.auth.GoogleAuthProvider();
    //     let oldUser = user.email
    //     let code = user.email.split('@')[1].slice(0,6)
    //     if(parseInt(user.email.split('@')[1].slice(0,6)).length < 5) {
    //         code = user.ws_code
    //     }
    //     Firebase.auth()
    //         .signInWithEmailAndPassword(user.email, code)
    //         .then(async function(userCredential) {
    //             await userCredential.user.updateEmail(email)
    //             await userCredential.user.updatePassword(password)
    //             await userCredential.user.updateProfile({displayName: user.ws})
    //             await currentUser.getIdToken().then(async token => { 
    //                 let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
    //                 let data = {
    //                     newValues: {
    //                         login: ['email'],
    //                         ws_code: code,
    //                         email: email || user.email,
    //                         password: password
    //                     }}
    //                 await axios.patch(`${node_patient}/${user.dni}`, data, {headers})
    //                     .then(res => {
    //                         dispatch({type: 'CLOSE_MODAL'})
    //                         dispatch({type: 'SET_USER_LOGIN', payload: 'email'})
    //                         dispatch({type: "LOADING", payload: false})
    //                     })
    //             })
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             if(err.message === "The email address is already in use by another account.") {
    //                 swal("Esta cuenta ya está en uso", "Intenta con otro email o logueate con la cuenta ya existente", "warning")
    //             } else if(err.message === "User can only be linked to one identity for the given provider.") {
    //                 swal("Ya tienes una cuenta de google vinculada", "No se puede vincular más de una cuenta del mismo sitio. Intenta con otro email.", "warning")
    //             } else if(err.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
    //                 swal("No se pudo vincular esta cuenta", "Intenta con otro email", "warning")
    //             } else {
    //                 swal("Ocurrió un error", err.message || err, "warning")
    //             }
    //             dispatch({type: "LOADING", payload: false})
    //         })

    // }, [email, password, validEmail, passValidation])

    return (
       <section className='login'>
           <img className='login__logo' src={Logo} alt='Logo de Uma Health'/>
           <section className='login__titleIllustration'>
                <img className='login__titleIllustration--illustration' src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='login__titleIllustration--title'>ÜMA, tu portal digital de salud</h1>
           </section>
           <LoginButtons circleBtn />
            <div className='login__lineSeparator'>o</div>
            {/* email o password invalido? state ? section : null */}
            <section className='login_invalid'>
                <p>El mail o la contraseña son incorrectos.</p>
                <p>Comprueba los datos ingresados o <a href='#'>crea una cuenta</a></p>
            </section>
            <GenericInputs label='Ingresa tu mail'/>
            <GenericInputs label='Ingresa tu contraseña' Password/>
           <section className='login__needHelp'>
                <aside className='login__needHelp__activeSession'>
                    <input className='check' type='checkbox'/>
                    <p className='text'>Mantener sesión iniciada</p>
                </aside>
                <button className='login__needHelp--btn'>Necesito ayuda</button> 
                {/* Link  */}
           </section>
           <section className='login__actions'>
                <GenericButton color='blue'>
                    Ingresar
                </GenericButton>
               <div className='login__actions__Registrer'>
                   <p className='text'>¿Eres nuevo en UMA?</p>
                    <a href='#' className='link'>Registrarme</a>
                    {/* Link */}
               </div>
           </section>
       </section>
    )
}

export default Login;
