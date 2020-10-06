import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedicalAlt, faCarAlt } from '@fortawesome/free-solid-svg-icons'
import { GenericHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import Backbutton from '../GeneralComponents/Backbutton';

const MyRecords = () => {
    const dispatch = useDispatch()
    const records = useSelector(state => state.queries.medicalRecord)
    const [tab, setTab] = React.useState(false)
    const {beneficiaries, patient} = useSelector(state => state.queries)

    useEffect(() => { window.scroll(0, 0); }, [])

    function selectBeneficiarieMr(p) {
        if (p === "owner") {
            console.log("owner")
            setTab(false)
            dispatch(getMedicalRecord(beneficiaries[0].group, beneficiaries[0].ws))
        } else {
            console.log("no owner")
            setTab(p.fullname)
            dispatch(getMedicalRecord(p.dni, p.ws))
        }
    }

    return (
        <>
            <GenericHeader>Mi historia</GenericHeader>
            <div className="myhistory-container">
                <Backbutton />
                <div className="text-center tab-container">
                    <button className={tab === patient.fullname ? "active btn btn-secondary" : "btn btn-secondary"}
                            onClick={() => selectBeneficiarieMr("owner")}> {patient.fullname} </button>
                    {beneficiaries.map((p, index) => {
                        return <button className={tab === p.fullname ? "active btn btn-secondary" : "btn btn-secondary"}
                            onClick={() => selectBeneficiarieMr(p)}
                            key={index}> {p.fullname} </button>
                    })}
                </div>
                <ul>
                    {records && records.length === 0 && <div className="text-center mt-5">
                        Aún no se encontraron registros para esta persona.</div>}
                    {records && records.map((r, index) => {
                        return (
                            r.mr.destino_final !== "USER CANCEL" &&
                            (r.mr.destino_final !== "" || r.incidente_id === 'auto') &&
                            <li key={index} className={r.incidente_id === 'DISCA' ? "transport myhistory-consultation" : (r.incidente_id === 'auto' ? "myhistory-consultation history-bg-autonomous" : "myhistory-consultation")}>
                                {r.incidente_id !== 'auto' ?
                                    <Link to={`./history/${r.patient.dni}/${r.assignation_id}`} className="d-flex">
                                        {r.incidente_id === 'DISCA' ?
                                            <div className="leftIcon">
                                                <FontAwesomeIcon icon={faCarAlt} />
                                            </div>
                                            :
                                            <div className="leftIcon">
                                                <FontAwesomeIcon icon={faFileMedicalAlt} />
                                            </div>}
                                        <div>
                                            <div className="consultContainer">
                                                {!!r.mr && r.mr.dt_cierre}
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
                                        </div>
                                    </Link>
                                    :
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
                                    </div>}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

export default MyRecords;