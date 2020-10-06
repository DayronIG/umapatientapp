import React from 'react';
import QRCode from 'qrcode.react';
import UMA_LOGO from '../../assets/icons/icon-168.png';

const Constancia = ({att, socialWork, docData}) => {
    return <> 
    {socialWork !== 'dosuba' ?
        <div className='p-4' id='dossier'>
            <h3 className='text-center'>Constancia de atención</h3><br />
            <img src={UMA_LOGO} className='uma-img' alt='' />
            <div className='dossier-date text-right mb-4'>
                Buenos Aires,<br /> {att.mr.dt_cierre}
            </div>
            <p className='text-left mb-5 dossier-text'>A quien corresponda:<br /><br />
                Se deja constancia que el día {att.mr.dt_cierre}, el/la Sr/Sra. {att && att.patient.fullname} (DNI {att && att.patient.dni})
                &nbsp; fue asistido/a a través de nuestro servicio de consultas por el médico {docData.fullname || ''} {docData.matricula && `(Matrícula ${docData.matricula})`}. <br />
                {att.mr.diagnostico && <p>Diagnóstico presuntivo:<div className='Break-Word'>{att.mr.diagnostico && att.mr.diagnostico.slice(0, -5)}</div></p>}
                {att && att.mr && att.mr.reposo && att.mr.reposo.toLowerCase() !== 'no' ? <> Se sugiere reposo de {att.mr.reposo} hs.</> : <></>}
                <br />
                Sin otro particular, saludamos muy atte.</p><br />
            <p>
                <b>
                    EMERGENCIAS<br />
                    Dirección Médica.
                </b>
            </p>
            <br />
            <small className='text-center'>
                <p>Verifique la atención en <br />
                    <a href='http://uma-health.com/att'>http://uma-health.com/att</a><br />
                    <b>Código:</b> {btoa(att.assignation_id).slice(0, -2)}<br /><br /></p>
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