import React from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment-timezone';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import './../../styles/history/constancia.scss';


const Constancia = ({att, socialWork, docData}) => {
    return <> 
    {socialWork !== 'dosuba' ?
        <div className='p-4' id='dossier-constancia'>
            <div className='dossier-date-img'>
                <img src={UMA_LOGO} className='uma-img' alt='' />
                <p><b>Buenos Aires,<br /> {att && moment(att.mr.dt_cierre).format("DD-MM-YYYY HH:mm")} </b></p>
            </div>
            <p className='text-left mb-5 dossier-text'>A quien corresponda:<br /><br />
                Se deja constancia que el día {att && moment(att.mr.dt_cierre).format('DD-MM-YYYY') }, el/la Sr/Sra. {att && att.patient.fullname} (DNI {att && att.patient.dni})
                &nbsp; fue asistido/a a través de nuestro servicio de consultas por el médico {docData.fullname || ''} {docData.matricula && `(Matrícula ${docData.matricula})`}. <br />
                {att.mr.diagnostico && 

                <p className="dossier-text-diagnostico">Diagnóstico presuntivo:<div className='Break-Word'>{att.mr.diagnostico && att.mr.diagnostico.slice(0, -5)}</div></p>}
                {att && att.mr && att.mr.reposo && att.mr.reposo.toLowerCase() !== 'no' ? <> Se sugiere reposo de {att.mr.reposo} hs.</> : <></>}
                <br />
                Sin otro particular, saludamos muy atte.</p><br />
            <p className="dossier-text-emergencias">
                <b>
                    EMERGENCIAS<br />
                    Dirección Médica.
                </b>
            </p>
            <br />
            <small className='text-center'>
                <p>Verifique la atención en <br />
                    <a href='http://uma-health.com/att'>http://uma-health.com/att</a><br />
                    Código: {btoa(att.assignation_id).slice(0, -2)}<br /><br /></p>
            </small>
            <div className='text-center mt-3'>
                <QRCode value={`http://uma-health.com/att/${att.patient.dni}/${btoa(att.assignation_id)}`} /><br />
            </div>
            <br /><br />
        </div>
        :
        <div className='text-center mt-4'>
            No disponible.
        </div>
    }
</>
}

export default Constancia