import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
    const voucherRef = useRef()
    const [docData, setDocData] = useState()
    const patient = useSelector(state => state.user)
    const [socialWork] = useState(patient.obra_social ? patient.obra_social.toLowerCase() : '')
    const [openModal, setOpenModal] = useState(false)
    const [sendIssue, setSendIssue] = useState(false)
    let { att, tab } = props

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
            {att.mr.dt_cierre && att.mr.dt_cierre !== '' && att.mr.destino_final !== 'Anula el paciente' &&
                att.mr.destino_final !== 'Anula por falla de conexión' &&
                att.mr.destino_final !== 'Paciente ausente' &&
                att.mr.destino_final !== 'USER CANCEL' &&
                !!docData ?
                <>
                    <div ref={voucherRef} className='dossier-container'>
                        {tab === 'resumen' && <Resumen docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo !== 'alta') && <Constancia docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo === 'alta') && <Alta docData={docData} att={att}/>}
                        {tab === 'receta' && <RecipeView att={att} doc={docData}/>}
                        {tab === 'ordenes' && <StudiesOrder att={att} doc={docData}/>}
                    </div>
                    {socialWork !== 'dosuba' &&
                        <>
                            {tab !== 'receta' && tab !== 'ordenes' &&
                                <div className='download-order'>
                                {/* // 'd-flex flex-column justify-content-center' */}
                                    <button className="button-d">
                                        <ReactToPrint
                                            trigger={() => (
                                                    <div className='patient-action'>{tab == 'resumen'? 'Descargar' : 'Descargar constancia'}</div>
                                            )}
                                            content={() => voucherRef.current}
                                        />
                                    </button>
                                    <div onClick={()=> setOpenModal(true)} className='button-report'>
                                        Reportar problema
                                    </div>
                                </div>
                            }
                        </>
                    }
                </>
                :
                <p className='no-orders'>Esta atención no se realizó o aún no fue cerrada por el médico</p>
            }

            {
                openModal && 
        
                <MobileModal title={ sendIssue ? '' : 'Reportar error'} callback={() =>setOpenModal(false) }>

                    {sendIssue ?
                    <div className='detail-modal-content'>
                        <h2>¡Gracias!</h2>
                        <p>Su reclamo fue enviado exitosamente</p>
                        <button className='button' onClick={() => setOpenModal(false)}>Cerrar</button>
                    </div>
                    :
                    <div className='detail-modal-content'>
                        <textarea placeholder='Escriba aquí el motivo del problema' ></textarea>
                        <button className='button' onClick={enviarReclamo}>Enviar problema</button> 
                    </div>
                    }

                </MobileModal>
            }
        </>
    )
}

export default withRouter(DossierContainer)