/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams } from 'react-router-dom';
import { HistoryHeader } from '../GeneralComponents/Headers';
import DossierContainer from './DossierContainer'
import { getVoucherById } from '../../store/actions/firebaseQueries';
import ValidateAction from '../ValidateAction/';
import './../../styles/history/HeaderContainer.scss';

const Record = (props) => {
    const dispatch = useDispatch()
    const att = useSelector((state) => state.queries.voucher)
    const {currentUser} = useSelector(state => state.userActive)
    const [tab, setTab] = useState('resumen')
    const {recipe} = useParams()

    useEffect(()=>{
        if(recipe) {
            setTab(recipe)
        }
    },[recipe])

    useEffect(() => {
        if(currentUser){
        dispatch(getVoucherById(currentUser.uid, props.aid))
    }
    }, [props.aid, currentUser])

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dispatch({ type: 'DOSSIER_MODAL', payload: false })
            }
        })
    })

    return (
        <>
            <HistoryHeader>Detalles de consulta</HistoryHeader>
            <div className='records-sections'>
                <button className={tab === 'resumen' ? 'focused button-record' : 'button-record'}
                    onClick={() => setTab('resumen')}>
                        Resumen
                </button>
                <ValidateAction action='not-clickable' field='constancy'>
                    <button className={tab === 'constancia' ? 'focused button-record' : 'button-record'}
                        onClick={() => setTab('constancia')}>
                        Constancia
                    </button>
                </ValidateAction>
                <ValidateAction action='not-clickable' field='recipe'>
                    <button className={tab === 'receta' ? 'focused button-record' : 'button-record'}
                        onClick={() => setTab('receta')}>
                        Receta
                    </button>
                </ValidateAction>
                <ValidateAction action='not-clickable' field='lab_orders'>
                    <button className={tab === 'ordenes' ? 'focused button-record' : 'button-record'}
                        onClick={() => setTab('ordenes')}>
                        Órdenes
                    </button>
                </ValidateAction>
            </div>
            {att && att.assignation_id ?
                <DossierContainer att={att} tab={tab} /> :
                <div className='record-not-completed'>
                    El Médico aún no completó la ficha de su consulta o se está cargando. Estará disponible en breve.
                </div>}

        </>
    )
}

export default withRouter(Record);