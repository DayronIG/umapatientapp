import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { HistoryHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord, getBenficiaries } from '../../store/actions/firebaseQueries';
import '../../styles/history/MyRecords.scss';

const MyRecords = () => {
    const dispatch = useDispatch()
    const [tab, setTab] = useState(false)
    const records = useSelector(state => state.queries.medicalRecord)
    const {beneficiaries} = useSelector(state => state.queries)
    const patient = useSelector(state => state.user)

    useEffect(() => { 
        window.scroll(0, 0);
        if(patient.dni) {
            dispatch(getBenficiaries(patient.dni))
            dispatch(getMedicalRecord(patient.dni, patient.ws))
        }
    }, [patient])

    function selectBeneficiarieMr(p) {
        if (p === "owner") {
            console.log("owner")
            setTab(false)
            dispatch(getMedicalRecord(beneficiaries?.[0]?.group, beneficiaries[0]?.ws))
        } else {
            console.log("no owner")
            setTab(p.fullname)
            dispatch(getMedicalRecord(p.dni, p.ws))
        }
    }

    return (
        <>
            <HistoryHeader> Consultas </HistoryHeader>
            <main className="my-history-container"> 
                <div className="title-icon">
                    <p className="font-weight-bold">Consultas médicas</p>
                    {/* <button><FaSlidersH/></button> */}
                </div>
                {/*  Beneficiary cambia de lugar con el nuevo diseño*/}
                <div className="my-history-beneficiary"> 
                    <button className={tab === patient.fullname ? "active button-patient" : "button-patient"} 
                            onClick={() => selectBeneficiarieMr("owner")}> {patient.fullname} </button>
                    {beneficiaries.map((p, index) => {
                        return <button className={tab === p.fullname ? "active button-patient" : "button-patient"}
                            onClick={() => selectBeneficiarieMr(p)}
                            key={index}> {p.fullname} </button>
                    })}
                </div>
                <ul>
                    {records && records.length === 0 && <div className="no-records">
                        Aún no se encontraron registros para esta persona.</div>}
                    {records && records.map((r, index) => {
                        return ( 
                            r.mr.destino_final !== "USER CANCEL" &&
                            (r.mr.destino_final !== "" || r.incidente_id !== 'auto') &&
                            <React.Fragment key={index}>
                                <li className="my-history-consultation">
                                        <Link to={`/history/${r.patient.dni}/${r.assignation_id}/${r.patient.ws}`} className="consult-link">
                                                <div className="left-icon">
                                                    <FontAwesomeIcon icon={faUserMd} />
                                                </div>
                                                <section className="title-date"> 
                                                    <p className="title-guardia">Guardia</p>
                                                    <p className="consult-date">{!!r.mr && moment(r.mr.dt_cierre).format('DD-MM-YYYY')}</p>
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