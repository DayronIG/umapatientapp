import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { getDoctor } from '../../store/actions/firebaseQueries';
import StudiesOrder from './StudiesOrder';
import Constancia from './Constancia';
import Alta from './Alta';
import Resumen from './Resumen';
import RecipeView from '../../views/RecipeView';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import '../../styles/orders.scss';

const DossierContainer = (props) => {
    const dispatch = useDispatch()
    const voucherRef = useRef()
    const [docData, setDocData] = useState()
    const patient = useSelector(state => state.user)
    const [socialWork] = useState(patient.obra_social ? patient.obra_social.toLowerCase() : '')
    const [openModal, setOpenModal] = useState(false)
    const [sendIssue, setSendIssue] = useState(false)
    let { att, tab } = props

    console.log('att', att)


    useEffect(() => {
        getDoctor(att.provider.cuit)
            .then(r => setDocData(r))
            .catch(e => console.error(e))
    }, [att.provider.cuit])

    const enviarReclamo = () => {
        setSendIssue(true)
        return console.log('Reclamo enviado')
    }



    return (
        <>
            {att.mr.dt_cierre && att.mr.dt_cierre !== "" && att.mr.destino_final !== 'Anula el paciente' &&
                att.mr.destino_final !== 'Anula por falla de conexión' &&
                att.mr.destino_final !== 'Paciente ausente' &&
                att.mr.destino_final !== 'USER CANCEL' &&
                !!docData ?
                <>
                    <div ref={voucherRef} className='dossier-container'>
                        {tab === 'resumen' && <Resumen docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo !== "alta") && <Constancia docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo === "alta") && <Alta docData={docData} att={att}/>}
                        {tab === 'receta' && <RecipeView att={att} doc={docData}/>}
                        {tab === 'ordenes' && <StudiesOrder att={att} doc={docData}/>}
                    </div>
                    {socialWork !== 'dosuba' &&
                        <>
                            {tab !== 'receta' && tab !== 'ordenes' &&
                                <div className='d-flex flex-column justify-content-center'>
                                    <div className='btn btn-blue-lg'>
                                        <ReactToPrint
                                            trigger={() => (
                                                <div className='d-flex justify-content-center'>
                                                    <div className='patient-action'>{tab == 'resumen'? 'Descargar' : 'Descargar constancia'}</div>
                                                </div>
                                            )}
                                            content={() => voucherRef.current}
                                        />
                                    </div>
                                    <div onClick={()=> setOpenModal(true)} className="btn btn-outline-primary btn-lg mt-2 ml-4 mr-4">
                                        Reportar problema
                                    </div>
                                </div>
                            }
                        </>
                    }
                </>
                :
                <div className='dossier-container mt-5'>
                    <p className='text-center mt-5 mb-5'>Esta atención no se realizó o aún no fue cerrada por el médico</p>
                </div>
            }

            {
                openModal && 
        
                <MobileModal title={ sendIssue ? '' : 'Reportar error'} callback={() =>setOpenModal(false) }>

                    {sendIssue ?
                    <div className="detail-modal-content">
                        <h2>¡Gracias!</h2>
                        <p>Su reclamo fue enviado exitosamente</p>
                        <button className="btn btn-blue" onClick={() => setOpenModal(false)}>Cerrar</button>
                    </div>
                    :
                    <div className='detail-modal-content'>
                        <textarea placeholder='Escriba aquí el motivo del problema' ></textarea>
                        <button className='btn btn-blue-lg' onClick={enviarReclamo}>Enviar problema</button> 
                    </div>
                    }

                </MobileModal>
            }
        </>
    )
}

export default withRouter(DossierContainer)