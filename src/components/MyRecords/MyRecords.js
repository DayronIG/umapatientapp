import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { HistoryHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import { FaSlidersH } from "react-icons/fa";
import '../../styles/history/MyRecords.scss';

const MyRecords = () => {
    const {category} = useParams();
    const dispatch = useDispatch()
    const records = useSelector(state => state.queries.medicalRecord)
    const [tab, setTab] = React.useState(false)
    const {beneficiaries} = useSelector(state => state.queries)
    const patient = useSelector(state => state.user)


    useEffect(() => { window.scroll(0, 0); }, [])

    function selectBeneficiarieMr(p) {
        if (p === "owner") {
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
            <div className="my-history-container"> 
                <div className="title-icon">
                    <p className="font-weight-bold">Consultas médicas</p>
                    <button><FaSlidersH/></button>
                </div>
                {/*  Beneficiary cambia de lugar */}
                <div className="my-history-beneficiary"> 
                    <button className={tab === patient.fullname ? "active button-patient" : "button-patient"} 
                            onClick={() => selectBeneficiarieMr("owner")}> {patient.fullname} </button>
                    {beneficiaries.map((p, index) => {
                        return <button className={tab === p.fullname ? "active button-patient" : "btn button-patient"}
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
                            <>
                                <li key={index} className="my-history-consultation">
                                    {/*</li>className={r.incidente_id === 'DISCA' ? "transport myhistory-consultation" : (r.incidente_id === 'auto' ? "myhistory-consultation history-bg-autonomous" : "myhistory-consultation")*/}
                                    {/*{r.incidente_id !== 'auto' ?*/}
                                    {/* ${r.patient.dni}/${r.assignation_id} */}
                                        <Link to={`/${r.patient.ws}/history/${r.patient.dni}/${r.assignation_id}`} className="consult-link">

                                                <div className="left-icon">
                                                    <FontAwesomeIcon icon={faUserMd} />
                                                </div>
                                                <div className="title-date"> 
                                                    <p className="title">Guardia</p>
                                                    <p className="consult-date">{!!r.mr && moment(r.mr.dt_cierre).format('DD-MM-YYYY')}</p>
                                                </div>

                                            {/*{r.incidente_id === 'DISCA' ?
                                                <div className="leftIcon">
                                                    <FontAwesomeIcon icon={faCarAlt} />
                                                </div>
                                                :
                                                <div className="leftIcon">
                                                    <FontAwesomeIcon icon={faUserNurse} />
                                                </div>
                                            }
                                            <div>
                                                <div className="consultContainer"> 
                                                    <p>Guardia</p>
                                                    <p className="font-weight-normal">{!!r.mr && moment(r.mr.dt_cierre).format('DD-MM-YYYY')}</p>
                                                </div>
                                                {r.incidente_id === 'DISCA' ?
                                                    <div>
                                                        <p>Traslado</p>
                                                    </div>
                                                    : r.mr.motivos_de_consulta &&
                                                    <div className="wrapper-consultContainer">
                                                        <p>Consulta por {r.mr.motivos_de_consulta}</p>
                                                    </div>
                                                }
                                            </div>*/}
                                            
                                        </Link>
                                    {/* :
                                        <div className="my-autonomous d-flex ">
                                            <div className="leftIcon">
                                                <i className="fas fa-vr-cardboard"></i>
                                            </div>
                                            <div>
                                                <div className="consultContainer">
                                                    {!!r.mr && r.mr.dt_cierre}
                                                </div>
                                                <div className="wrapper-consultContainer">
                                                    <p>Autonomous: {r.mr.epicrisis}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }*/} 
                                </li>
                                <hr/>
                            </>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

export default MyRecords;