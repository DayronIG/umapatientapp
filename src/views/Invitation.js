import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/vaccine/Vaccine.scss';
import welcomeImg from '../assets/doctor-online.svg';
import checkIllustration from '../assets/vaccine/check.png';
import Loading from '../components/GeneralComponents/Loading';
import {BackButton} from '../components/GeneralComponents/Headers'
import db from '../config/DBConnection';
import { invitation } from '../config/endpoints';

const Vaccine = () => {
    const history = useHistory()
    const { id } = useParams();
    const firestore = db.firestore();
    const [modal, setModal] = useState({
        show: false,
        title: '',
        text: '',
        note: '',
        action: '',
    });
    const [cancelComment, setCancelComment] = useState("Me arrepentí")
    const [initialData, setInitialData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            firestore.collection('events').doc('invitations').collection('register').doc(id)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        setInitialData({...doc.data(), id: doc.id});
                        setLoading(false);
                    }
                })
        }
    }, [id]);

    const handleRejectService = async (comment, type, id) => {
        setLoading(true);
        const data = {
            comment,
            type, 
            id
        }
        await axios.post(`${invitation}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => {
                setLoading(false);
                setModal({
                    ...modal,
                    show: false,
                })
            })
            .catch(error => console.log(error));
        setLoading(false)
    }

    const _handleComment = (e) => {
        setCancelComment(e.target.value)
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
                                title: 'Por favor detalla el motivo por el que ya no quieres el servicio',
                                type: 'cancel',
                                action: 'reject'})}>
                            No
                        </button>
                        <button
                            className="vaccineBtn vaccineConfirm"
                            onClick={() => history.push(`/${initialData.ws}`)}>
                            Si
                        </button>
                    </div>
                    <button className="btn-alert" onClick={() => setModal({
                                ...modal,
                                show: true,
                                title: 'Por favor introduce la mayor cantidad posible de detalles sobre el problema',
                                type: 'problem',
                                action: 'reject'})}>
                        Reportar un problema
                    </button>
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
                    <h6 className="vaccineModalTitle">{modal.title}</h6>
                    {modal.type === 'cancel' ?
                    <>
                        <select
                            className='form-control mb-1'
                            onChange={(e) => { _handleComment(e)}}>
                            <option value="Me arrepentí" >Me arrepentí</option>
                            <option value="No es lo que buscaba" >No es lo que buscaba</option>
                            <option value="No puedo registrarme" >No puedo registrarme</option>
                            <option value="Otro" >Otro</option>
                        </select>
                        {cancelComment !== 'Me arrepentí' &&
                        cancelComment !== 'No es lo que buscaba' &&
                        cancelComment !== 'No puedo registrarme' && (
                            <textarea
                                className='form-control'
                                onChange={(e) => setCancelComment(e.target.value)}
                                placeholder='Ingrese otro motivo (opcional)'
                            />
                        )}
                        </> :
                        <> 
                            <textarea
                                className='form-control'
                                onChange={(e) => setCancelComment(e.target.value)}
                                placeholder='Ingrese los detalles aquí'
                                />
                        </>}
                        <div className="vaccineModalBtns mt-5">
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
                                onClick={() => { handleRejectService(cancelComment, modal.type, initialData.id)}}>
                                Confirmar
                            </button>
                        </div>
                </div>
            </div>}
        </div>
    </>
)
}

export default Vaccine;