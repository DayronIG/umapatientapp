import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import Balloons from '../../../assets/illustrations/balloons.png';
import ErrorSign from '../../../assets/illustrations/Error.png';
import Congrats from '../../../assets/icons/congrats.png';
import { GenericButton } from '../Login/GenericComponents';
import { useParams } from 'react-router-dom';


const Status = () => { // Congrats / Error / DataSaved
    const [congratsOrError, setCongratsOrError] = useState('dataSaved')
    const [startAnimate, setStartAnimate] = useState(false)
    const {status} = useParams()
    const history = useHistory()

    useEffect(() => {
        setTimeout(() => {
            setStartAnimate(true) 
        }, 100);
        // set time out also redirects
    }, [])

    useEffect(() => {
        if(status) {
            setCongratsOrError(status)
        }
    }, [status])

    return (
        <>
        <section className='signUp' style={congratsOrError == 'dataSaved' ? {display: 'none'} : null}>
            <img src={Logo} className='signUp__logo' alt='UMA logo' onClick={() => history.push('/')}/>
            <section className='signUp__content'>
                {congratsOrError == 'congrats' &&
                    <img src={Balloons} className='signUp__content--illustration' alt='Balloons'/>
                }
                {congratsOrError == 'error' &&
                    <img src={ErrorSign} className='signUp__content--illustration error' alt='Error sign'/>
                }
                <section className='signUp__content__mainText'>
                    {congratsOrError == 'congrats' && 
                    <>
                        <h1 className='title'>¡Felicitaciones!</h1>
                        <p className='subtitle'>Ya eres parte de UMA. Te hemos enviado un mail de verificación.</p>
                    </>
                    }
                    {congratsOrError == 'error' &&
                    <>
                        <h1 className='title failed'>¡Lo sentimos!</h1>
                        <p className='subtitle'>Ha ocurrido un error y no hemos podido guardar los datos ingresados.</p>
                        <p className='subtitle'>Por favor, intenta nuevamente.</p>
                    </>
                    }
                </section>
                {congratsOrError == 'congrats' && 
                    <GenericButton action={()=> history.push('/')} >
                        Ingresar
                    </GenericButton>
                }
                {congratsOrError == 'error' && 
                    <GenericButton>
                        Intentar de nuevo
                    </GenericButton>}
            </section>
        </section>

        {congratsOrError == 'dataSaved' && 
            <div className={startAnimate ? 'dataSaved open' : 'dataSaved' }>
                <img src={Congrats} alt='Success' className='illustration'/>
                <h1 className='dataSaved--title'>¡Datos guardados!</h1>
            </div> 
        }
        </>
    )
}

export default Status;
