import React from 'react';
import '../../../styles/login/login.scss';
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import Logo from '../../../assets/logo.png';

function Login() {
    return (
       <section className='login'>
           <img className='login_logo' src={Logo} alt='Uma logo'/>
       </section>
    )
}

export default Login;
