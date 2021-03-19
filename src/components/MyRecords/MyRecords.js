import React, { useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { HistoryHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord, getBenficiaries } from '../../store/actions/firebaseQueries';
import '../../styles/history/MyRecords.scss';

const MyRecords = () => {
    // const {category} = useParams();
    const dispatch = useDispatch()
    const records = useSelector(state => state.queries.medicalRecord)
    const {beneficiaries} = useSelector(state => state.queries)
    const patient = useSelector(state => state.user)
    const {currentUser} = useSelector(state => state.userActive)
    const [selected, setSelected] = useState(patient.dni)

    useEffect(() => { 
        window.scroll(0, 0);
        if(patient.dni) {
            dispatch(getBenficiaries(currentUser.uid))
            dispatch(getMedicalRecord(currentUser.uid, false))
            setSelected(patient.dni)
        }
    }, [patient])

    function selectBeneficiarieMr(active) {
        if (active === 'owner') {
            dispatch(getMedicalRecord(currentUser.uid, false))
            setSelected(patient.dni)
        } else {
            dispatch(getMedicalRecord(currentUser.uid, active))
            let currentDependant = beneficiaries.find(p => p.id === active)
            setSelected(currentDependant.dni)
        }
    }

    return (
        <>
            <HistoryHeader> Consultas </HistoryHeader>
            <main className='my-history-container'> 
                <div className='title-icon'>
                    <p className='font-weight-bold'>Consultas médicas</p>
                </div>
                <div className='my-history-beneficiary'> 
                    <select className='select-beneficiary' onChange={(p) => selectBeneficiarieMr(p.target.value)}>
                        <option key={123} value={`owner`}> {patient.fullname} </option>
                    {beneficiaries.map((p, index) => {
                        return <option key={index} value={`${p.id}`}> {p.fullname} </option>
                    })}
                    </select>
                </div>
                <ul>
                    {records && records.filter(r => r.mr.destino_final !== 'USER CANCEL' && 
                            r.mr.destino_final !== 'Anula el paciente' && r.mr.destino_final !== 'Paciente ausente' &&
                            r.mr.dt_cierre !== '' &&  r.incidente_id !== 'auto').length === 0 && <div className='no-records'>
                        Aún no se encontraron registros para esta persona.</div>}
                    {records && records.map((r, index) => {
                        return ( 
                            r.mr.destino_final !== 'USER CANCEL' && 
                            r.mr.destino_final !== 'Anula el paciente' && r.mr.destino_final !== 'Paciente ausente' &&
                            r.mr.dt_cierre !== '' &&  r.incidente_id !== 'auto' &&
                            r.patient.dni === selected &&
                            <React.Fragment key={index}>
                                <li className='my-history-consultation'>
                                        <Link to={`/history/${r.patient.dni}/${r.assignation_id}`} className='consult-link'>
                                            
                                                <div className='left-icon'>
                                                {r.mr_preds.pre_clasif === '' ?
                                                    <FontAwesomeIcon icon={faUserNurse} />
                                                    : 
                                                    <FontAwesomeIcon icon={faUserMd} />
                                                }
                                                </div>
                                                <section className='title-date'> 
                                                        {typeof r.mr_preds.pre_clasif === 'string' ?
                                                        <p className='title-clasif'>Guardia</p> 
                                                        : 
                                                        <p className='title-clasif'>{r.mr_preds?.pre_clasif?.[2] || 'Médico clínico'}</p>
                                                        }
                                                    
                                                    <p className='consult-date'>{!!r.mr && moment(r.mr?.dt_cierre).format('DD-MM-YYYY')}</p>
                                                </section>
                                        </Link>
                                    </li>
                                <hr/>
                            </React.Fragment>
                        )
                    })}
                </ul>
            </main>
        </>
    )
}

export default MyRecords;