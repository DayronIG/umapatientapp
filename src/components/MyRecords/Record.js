/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { GenericHeader } from '../GeneralComponents/Headers';
import DossierContainer from './DossierContainer'
import { getVoucherById } from '../../store/actions/firebaseQueries';
import BackButton from '../GeneralComponents/Backbutton';
import ValidateAction from '../ValidateAction/';
const Record = (props) => {
    const dispatch = useDispatch()
    const att = useSelector((state) => state.queries.voucher)
    const [tab, setTab] = useState('resumen')
    const { patient } = useSelector(state => state.queries)

    useEffect(() => {
        let u = JSON.parse(localStorage.getItem('userData'))
        // console.log('With get Voucher', props.dni, props.aid)
        dispatch(getVoucherById(props.dni, props.aid))
    }, [dispatch, props.aid])

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dispatch({ type: 'DOSSIER_MODAL', payload: false })
            }
        })
    })

    return (
        <>
            <div>
                <GenericHeader >Datos de su consulta</GenericHeader>
                <BackButton customTarget={`/${patient.ws}/history`} />
            </div>
            <div className='text-center tab-container mt-3'>
                <button className={tab === 'resumen' ? 'active btn btn-secondary' : 'btn btn-secondary'}
                    onClick={() => setTab('resumen')}>
                    Resumen
                </button>
                <ValidateAction action='not-clickable' field='constancy'>
                    <button className={tab === 'constancia' ? 'active btn btn-secondary' : 'btn btn-secondary'}
                        onClick={() => setTab('constancia')}>
                        Constancia
                    </button>
                </ValidateAction>
                <ValidateAction action='not-clickable' field='recipe'>
                    <button className={tab === 'receta' ? 'active btn btn-secondary' : 'btn btn-secondary'}
                        onClick={() => setTab('receta')}>
                        Receta
                    </button>
                </ValidateAction>
                <ValidateAction action='not-clickable' field='lab_orders'>
                    <button className={tab === 'ordenes' ? 'active btn btn-secondary' : 'btn btn-secondary'}
                        onClick={() => setTab('ordenes')}>
                        Órdenes
                    </button>
                </ValidateAction>
            </div>
            {att && att.assignation_id ?
                <DossierContainer att={att} tab={tab} /> :
                <div className='p-3 text-center mt-5'>
                    El Médico aún no completó la ficha de su consulta o se está cargando. Estará disponible en breve.
                </div>}
            <div className='btn btn-blue-lg mt-3' onClick={() => props.history.push('/')}>
                Inicio
            </div>
        </>
    )
}

export default withRouter(Record);