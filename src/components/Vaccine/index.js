import React, { useState, useEffect } from 'react';
import '../../styles/vaccine/Vaccine.scss';
import vaccineIllustration from '../../assets/vaccine/vaccine.png';
import checkIllustration from '../../assets/vaccine/check.png';
import db from '../../config/DBConnection';
import { useParams } from 'react-router-dom';
import Loading from '../GeneralComponents/Loading';
import { vaccine } from '../../config/endpoints';
import axios from 'axios';
import {BackButton} from '../GeneralComponents/Headers'

const Vaccine = () => {
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
    const [initialStatus, setInitialStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        if (id) {
            firestore.collection('events').doc('requests').collection('vaccine').doc(id)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        setInitialStatus(doc.data().status);
                        setPatientName(`${doc.data().patient.first_name} ${doc.data().patient.last_name}`);
                        setLoading(false);
                    }
                })
        }
    }, [id]);

    const handleConfirmVaccine = () => {
        setLoading(true);
        const data = {
            "author": patientName,
            "status": modal.action === 'confirm' ? 'ACEPTED' : 'REJECTED',
        }

        console.log(data);

        axios.post(`${vaccine}/confirmation/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setActionConfirmed(true);
                setLoading(false);
            })
            .catch(error => setLoading(false));
    }

    return (
        <>
            <BackButton />
            <div className="vaccine">
                {loading && <Loading />}
                {
                    initialStatus === 'PENDING' ?
                        <div className="vaccineContainer">
                            {
                                !actionConfirmed ?
                                    <>
                                        <img src={vaccineIllustration} alt="Vacunación" className="vaccineIllustration" />
                                        <h1 className="vaccineTitle">Vacunate contra el COVID-19</h1>
                                        <p className="vaccineText">Tu empresa te ha seleccionado para aplicarte la vacuna contra el virus COVID-19.</p>
                                        <p className="vaccineText">¿Deseas vacunarte?</p>
                                        <div className="vaccineBtns">
                                            <button
                                                className="vaccineBtn vaccineReject"
                                                onClick={() => setModal({
                                                    ...modal,
                                                    show: true,
                                                    title: 'Estás por rechazar la vacunación contra el virus COVID-19',
                                                    action: 'reject',
                                                })}
                                            >
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
                                    </> :
                                    <>
                                        <img src={checkIllustration} alt="Confirmación" className="vaccineIllustrationCheck" />
                                        <h1 className="vaccineTitle">Hemos recibido tu respuesta</h1>
                                        {
                                            modal.action === 'reject' ?
                                                <p className="vaccineText">Hemos registrado que no deseas vacunarte contra el virus COVID-19.</p> :
                                                <>
                                                    <p className="vaccineText">En los próximos días podrás agendar tu turno para aplicarte la primer dosis de la vacuna.</p>
                                                    <p className="vaccineText">Te llegará una notificación cuando se habiliten los turnos.</p>
                                                </>
                                        }
                                        <a href="https://umaonline-patient.web.app/" className="vaccineLink">Ir al inicio</a>
                                    </>
                            }
                        </div> :
                    initialStatus === 'ACEPTED' ?
                        <div className="vaccineContainer">
                            <img src={checkIllustration} alt="Confirmación" className="vaccineIllustrationCheck" />
                            <h1 className="vaccineTitle">Hemos recibido tu respuesta</h1>
                            <p className="vaccineText">En los próximos días podrás agendar tu turno para aplicarte la primer dosis de la vacuna.</p>
                            <p className="vaccineText">Te llegará una notificación cuando se habiliten los turnos.</p>
                            <a href="https://umaonline-patient.web.app/" className="vaccineLink">Ir al inicio</a>
                        </div> :
                        <div className="vaccineContainer">
                            <img src={checkIllustration} alt="Confirmación" className="vaccineIllustrationCheck" />
                            <h1 className="vaccineTitle">Hemos recibido tu respuesta</h1>
                            <p className="vaccineText">Hemos registrado que no deseas vacunarte contra el virus COVID-19.</p>
                            <a href="https://umaonline-patient.web.app/" className="vaccineLink">Ir al inicio</a>
                        </div>
                }

                {
                    modal.show &&
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
                                    }}
                                >
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