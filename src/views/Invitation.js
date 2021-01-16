import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/vaccine/Vaccine.scss';
import welcomeImg from '../assets/doctor-online.svg';
import checkIllustration from '../assets/vaccine/check.png';
import Loading from '../components/GeneralComponents/Loading';
import {BackButton} from '../components/GeneralComponents/Headers'
import db from '../config/DBConnection';
import { vaccine } from '../config/endpoints';

const Vaccine = () => {
    const history = useHistory()
    const { id } = useParams();
    const firestore = db.firestore();
    const [modal, setModal] = useState({
        show: false,
        title: '',
        text: '¿Desea continuar?',
        note: 'NOTA: Esta acción no se puede deshacer',
        action: '',
    });
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const [initialData, setInitialData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            firestore.collection('events').doc('invitations').collection('register').doc(id)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        setInitialData(doc.data());
                        setLoading(false);
                    }
                })
        }
    }, [id]);

    const handleConfirmVaccine = () => {
        setLoading(true);
        const data = {}
        axios.post(`${vaccine}/confirmation/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }})
        .then(response => {
            setActionConfirmed(true);
            setLoading(false);
        })
        .catch(error => console.log(error));
    }

    return (
        <>
            <BackButton />
            <div className="vaccine">
            {loading && <Loading />}
            {!initialData.registered ?
                <div className="vaccineContainer">
                <>
                    <img src={welcomeImg} alt="Vacunación" className="vaccineIllustration" />
                    <h1 className="vaccineTitle">Bienvenido a ÜMA</h1>
                    <p className="vaccineText">Por favor confirma tu solicitud para continuar con el registro y acceder a nuestros servicios. Si te arrepentiste o no quieres acceder por esta vía cliquea "No". Si tuviste algún inconveniente con el registro cliquea "Reportar un problema"</p>
                    <p className="vaccineText"><b>¿Aún deseas ingresar?</b></p>
                    <div className="vaccineBtns">
                        <button
                            className="vaccineBtn vaccineReject"
                            onClick={() => setModal({
                                ...modal,
                                show: true,
                                title: 'Estás por rechazar la vacunación contra el virus COVID-19',
                                action: 'reject',
                            })}>
                            No
                        </button>
                        <button
                            className="vaccineBtn vaccineConfirm"
                            onClick={() => setModal({
                                ...modal,
                                show: true,
                                title: 'Estás por aceptar la vacunación contra el virus COVID-19',
                                action: 'confirm',
                            })}
                        >
                            Si
                        </button>
                    </div>
                    <button className="btn-alert" onClick={() => console.log(true)}>Reportar un problema</button>
                </>
                </div> :
                <div className="vaccineContainer">
                    <img src={checkIllustration} alt="Confirmación" className="vaccineIllustrationCheck" />
                    <h1 className="vaccineTitle">Hemos recibido tu respuesta</h1>
                    <p className="vaccineText">En los próximos días podrás agendar tu turno para aplicarte la primer dosis de la vacuna.</p>
                    <p className="vaccineText">Te llegará una notificación cuando se habiliten los turnos.</p>
                    <a href="https://umaonline-patient.web.app/" className="vaccineLink">Ir al inicio</a>
                </div>
        }
        {modal.show &&
            <div className="vaccineOverlay">
                <div className="vaccineModal">
                    <p className="vaccineModalTitle">{modal.title}</p>
                    <p className="vaccineModalText">{modal.text}</p>
                    <p className="vaccineModalNote">{modal.note}</p>

                    <div className="vaccineModalBtns">
                        <button
                            className="vaccineModalBtn vaccineModalCancel"
                            onClick={() => setModal({
                                ...modal,
                                show: false,
                            })}
                        >
                            Cancelar
                        </button>
                        <button
                            className="vaccineModalBtn vaccineModalConfirm"
                            onClick={() => {
                                setModal({
                                    ...modal,
                                    show: false,
                                })
                                handleConfirmVaccine()
                            }}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        }
        </div>
    </>
)
}

export default Vaccine;