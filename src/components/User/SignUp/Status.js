import React, { useState, useEffect } from 'react';
import Logo from '../../../assets/logo.png';
import Balloons from '../../../assets/illustrations/balloons.png';
import ErrorSign from '../../../assets/illustrations/Error.png';
import Congrats from '../../../assets/icons/congrats.png';
import { GenericButton } from '../Login/GenericComponents';


const Status = () => { // Congrats / Error / DataSaved
    const [congratsOrError, setCongratsOrError] = useState('DataSaved')
    const [startAnimate, setStartAnimate] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setStartAnimate(true) 
        }, 100);
        // set time out also redirects
    }, [])

    return (
        <>
        <section className='signUp' style={congratsOrError == 'DataSaved' ? {display: 'none'} : null}>
            <img src={Logo} className='signUp__logo' alt='UMA logo'/>
            <section className='signUp__content'>
                {congratsOrError == 'Congrats' &&
                    <img src={Balloons} className='signUp__content--illustration' alt='Balloons'/>
                }
                {congratsOrError == 'Error' &&
                    <img src={ErrorSign} className='signUp__content--illustration error' alt='Error sign'/>
                }
                <section className='signUp__content__mainText'>
                    {congratsOrError == 'Congrats' && 
                    <>
                        <h1 className='title'>¡Felicitaciones!</h1>
                        <p className='subtitle'>Ya eres parte de UMA. Puedes ingresar a la plataforma.</p>
                    </>
                    }
                    {congratsOrError == 'Error' &&
                    <>
                        <h1 className='title failed'>¡Lo sentimos!</h1>
                        <p className='subtitle'>Ha ocurrido un error y no hemos podido guardar los datos ingresados.</p>
                        <p className='subtitle'>Por favor, intenta nuevamente.</p>
                    </>
                    }
                </section>
                {congratsOrError == 'Congrats' && <GenericButton color='blue'>Ingresar</GenericButton>}
                {congratsOrError == 'Error' && <GenericButton color='blue'>Intentar de nuevo</GenericButton>}
            </section>
        </section>

        {congratsOrError == 'DataSaved' && 
            <div className={startAnimate ? 'dataSaved open' : 'dataSaved' }>
                <img src={Congrats} alt='Success' className='illustration'/>
                <h1 className='dataSaved--title'>¡Datos guardados!</h1>
            </div> 
        }
        </>
    )
}

export default Status;
