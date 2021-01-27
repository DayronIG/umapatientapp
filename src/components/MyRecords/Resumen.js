import React, { useEffect } from 'react';
import moment from 'moment-timezone';
import QRCode from 'qrcode.react';
// import { getDoctor } from '../../store/actions/firebaseQueries';
import '../../styles/orders.scss';

const Resumen = ({att, docData}) => {


    return <div id='receta'>
        <div className='dossier-att-info'>
            <div className="date-prescription">
                <div>
                    <p><b>Fecha de atención:</b><br /> </p>
                    <span className='dossier-info'>{att && moment(att.mr.dt_cierre).format('DD-MM-YYYY') || '-'} </span>
                </div>
                <div>
                    <p><b>Hora de atención:</b><br /> </p>
                    <span className='dossier-info'>{att && moment(att.mr.dt_cierre).format("HH:mm") || '-'} </span>
                </div>
            </div>
            <hr />
            <p><b>Paciente:</b><br /></p>
            <span className='dossier-info'>{att.patient.fullname}</span><br />
            <hr />
            <p><b>DNI: </b></p>
            <span className='dossier-info'>{att.patient.dni}</span><br />
            <hr />
            {att.mr.motivos_de_consulta &&
                <>
                    <p><b>Motivo de consulta</b><br />{att.mr.motivos_de_consulta || '-'}</p>
                    <hr />
                </>}
        
            <p><b>Resumen de la atención:</b> <br />{att.mr.epicrisis || '-'}</p>
            <hr />
            {att.mr.diagnostico && <span> <p><b>Diagnóstico:</b> <br/></p> <span className='dossier-info'> {att.mr.diagnostico} 
            </span> </span>}
            <hr />
            <p><b>Médico</b></p>
            <span ><b>Nombre: </b> {docData.fullname} </span><br />
            {docData.matricula && <span><b>Matrícula: </b>
                {/* OJO! o_o -> att.mr_preds.dt es el PAÍS en MR */}
                {(att.mr_preds.dt && att.mr_preds.dt !== 'AR') ?
                    docData.matriculas[att.mr_preds.dt] && docData.matriculas[att.mr_preds.dt].matricula :
                    docData.matricula ? docData.matricula : ''} </span>}<br />
                <p><b>Firma: </b></p>
            <div className='download-qr'>
                <img src={docData.signature} style={{width: '200px'}} alt='doctor signature'/>
                <QRCode value={`http://uma-health.com/att/${att.patient.dni}/${btoa(att.assignation_id)}`} /><br />
            </div>
        </div>
    </div>
}

export default Resumen