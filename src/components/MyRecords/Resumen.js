import React from 'react';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import QRCode from 'qrcode.react';

const Resumen = ({att, docData}) => {
    return <div className='d-flex flex-column justify-content-between p-2' id='dossier'>
        <div className='dossier-att-info'>
            <img src={UMA_LOGO} className='uma-img' alt='' />
            <p><b>Fecha</b><br /></p>
            {att.mr.dt_cierre || '-'}
            <hr />
            <p><b>Paciente</b><br /></p>
            <span className='dossier-patient-name'>Nombre: {att.patient.fullname}</span><br />
            <span className='dossier-doctor-dni'>DNI: {att.patient.dni}</span><br />
            <hr />
            {att.mr.motivos_de_consulta &&
                <>
                    <p><b>Motivo de consulta</b><br />{att.mr.motivos_de_consulta || '-'}</p>
                    <hr />
                </>}
            <p><b>Resumen de la atención</b><br />{att.mr.epicrisis || '-'}</p>
            <hr />
            <p><b>Indicaciones</b><br />{att.mr.tratamiento || '-'}</p>
            <hr />
            <p><b>{att.mr.reposo === "alta" ? "Alta" : "Reposo"}</b><br />{att.mr.reposo || 'No'}</p>
            <hr />
            {att.mr.diagnostico && <p><b>Diagnóstico:</b><span className='Break-Word'>{att.mr.diagnostico}</span></p>}
            <hr />
            <p><b>Médico</b><br /></p>
            <span className='dossier-doctor-name'>Nombre: {docData.fullname} </span><br />
            {docData.matricula && <span className='dossier-doctor-enroll'>Matrícula:
                {/* OJO! o_o -> att.mr_preds.dt es el PAÍS en MR */}
                {(att.mr_preds.dt && att.mr_preds.dt !== 'AR') ?
                    docData.matriculas[att.mr_preds.dt] && docData.matriculas[att.mr_preds.dt].matricula :
                    docData.matricula ? docData.matricula : ''} </span>}<br />
            <div className='text-center mt-3'>
                <QRCode value={`http://uma-health.com/att/${att.patient.dni}/${btoa(att.assignation_id)}`} /><br />
            </div>
        </div>
    </div>
}

export default Resumen