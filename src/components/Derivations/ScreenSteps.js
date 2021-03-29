import React, { useEffect, useState } from 'react';
import { getDerivationStatus } from '../../store/actions/firebaseQueries';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../GeneralComponents/Backbutton';
import DoctorScreen from '../../assets/illustrations/DoctorScreen.png';
import '../../styles/derivations/derivations.scss';

const ScreenSteps = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector((state)=> state.user)
    const derivation = useSelector((state) => state.derivations.derivation);
    const [completed, setCompleted] = useState({step1: false, step2: false})

    useEffect(() => {
        switch (derivation.derivationStatus) {
            case('Despachado'):
                return setCompleted({...completed, step1: true})
            case('Rumbo a lugar de derivación'):
                return setCompleted({...completed, step1: true, step2: true})
            case('Finalizado/No registrado'):
                return () => history.push('/')
        }
    }, [derivation])

    useEffect(() => {
        if(user.core_id !== '') {
            dispatch(getDerivationStatus(user.core_id))
        }
    }, [user])

    return (
        <section className='derivation'>
            <BackButton inlineButton/>
            <img src={DoctorScreen} alt='Ilustracion de medico saliendo de la pantalla' />
            <section className='derivation__status'>
                <div className='derivation__status__steps'>
                    <ul className='derivation__stepper'>
                        <li className={completed.step1 ? 'derivation__step first completed' : 'derivation__step first'}></li>
                        <li className={completed.step1 ? 'derivation__bar blue' : 'derivation__bar'}></li>
                        <li className={completed.step2 ? 'derivation__step second completed' : 'derivation__step second'}></li>
                    </ul>
                </div>
                <div className='derivation__status__boxes'>
                    <div className={completed.step1 ? 'box completed' : 'box'}>
                        <p>
                            Se le ha asignado un médico/enfermero de Emergencias S.A
                        </p>
                    </div>
                    <div className={completed.step2 ? 'box completed' : 'box'}>
                        <p>
                            Su médico/enfermero se encuentra camino a su domicilio
                        </p>
                    </div>
                </div>
            </section>  
        </section>
    )
}

export default ScreenSteps;
