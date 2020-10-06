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
import '../../styles/orders.scss';

const DossierContainer = (props) => {
    const voucherRef = useRef()
    const [docData, setDocData] = useState()
    const patient = useSelector(state => state.queries.patient)
    const [socialWork] = useState(patient.obra_social ? patient.obra_social.toLowerCase() : '')
    let { att, tab } = props

    useEffect(() => {
        getDoctor(att.provider.cuit)
            .then(r => setDocData(r))
            .catch(e => console.error(e))
    }, [att.provider.cuit])

    return (
        <>
            {att.mr.destino_final !== 'Anula el paciente' &&
                att.mr.destino_final !== 'Anula por falla de conexión' &&
                att.mr.destino_final !== 'Paciente ausente' &&
                att.mr.destino_final !== 'USER CANCEL' &&
                !!docData ?
                <>
                    <div ref={voucherRef} className='dossier-container'>
                        {tab === 'resumen' && <Resumen docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo !== "alta") && <Constancia docData={docData} att={att} />}
                        {(tab === 'constancia' && att.mr.reposo === "alta") && <Alta docData={docData} att={att} />}
                        {tab === 'receta' && <RecipeView att={att} doc={docData} />}
                        {tab === 'ordenes' && <StudiesOrder att={att} doc={docData} />}
                    </div>
                    {socialWork !== 'dosuba' &&
                        <>
                            {tab !== 'receta' && tab !== 'ordenes' &&
                                <div className='d-flex justify-content-around'>
                                    <div className='btn btn-blue-lg'>
                                        <ReactToPrint
                                            trigger={() => (
                                                <div className='d-flex justify-content-center'>
                                                    <div className='patient-action'>Descargar</div>
                                                </div>
                                            )}
                                            content={() => voucherRef.current}
                                        />
                                    </div>
                                </div>
                            }
                        </>
                    }
                </>
                :
                <div className='dossier-container mt-5'>
                    <p className='text-center mt-5 mb-5'>Esta atención no se realizó por {att.mr.destino_final}</p>
                </div>
            }
        </>
    )
}

export default withRouter(DossierContainer)