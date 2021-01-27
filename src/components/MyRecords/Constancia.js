import React from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment-timezone';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import './../../styles/history/Constancia.scss';


const Constancia = ({att, socialWork, docData}) => {
    return <> 
    {socialWork !== 'dosuba' ?
        <div id='constancy'>
            <div className='date-img'>
                <img src={UMA_LOGO} className='uma-img' alt='' />
                <p>Buenos Aires,<br /> {att && moment(att.mr.dt_cierre).format("DD-MM-YYYY HH:mm")}</p>
            </div>
            <p className='constancy-content'>A quien corresponda:<br /><br />
            {/* 'text-left mb-5 dossier-text' */}
                Se deja constancia que el día {att && moment(att.mr.dt_cierre).format('DD-MM-YYYY') }, el/la Sr/Sra. {att && att.patient.fullname} (DNI {att && att.patient.dni})
                &nbsp; fue asistido/a a través de nuestro servicio de consultas por el médico {docData.fullname || ''} {docData.matricula && `(Matrícula ${docData.matricula})`}. <br />
                {att.mr.diagnostico && 

                <p className="constancy-diagnosis">Diagnóstico presuntivo:<div className='Break-Word'>{att.mr.diagnostico && att.mr.diagnostico.slice(0, -5)}</div></p>}
                {att && att.mr && att.mr.reposo && att.mr.reposo.toLowerCase() !== 'no' ? <> Se sugiere reposo de {att.mr.reposo} hs.</> : <></>}
                <br />
                Sin otro particular, saludamos muy atte.</p><br />
            <p className="text-emergencias">
                    EMERGENCIAS<br />
                    Dirección Médica.
            </p>
            <br />
            <div className='verify-attention'>
                <p>Verifique la atención en: </p>
                <a href='http://uma-health.com/att'>http://uma-health.com/att</a>
                <p>Código: </p>
                <p>{btoa(att.assignation_id).slice(0, -2)}</p>
                <br />
            </div>
            <div className='text-center mt-3'>
                <QRCode value={`http://uma-health.com/att/${att.patient.dni}/${btoa(att.assignation_id)}`} /><br />
            </div>
            <br /><br />
        </div>
        :
        <div className='not-available'>
            No disponible.
        </div>
    }
</>
}

export default Constancia;