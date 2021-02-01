import React from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment-timezone';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import './../../styles/history/Constancia.scss';


const Constancia = ({att, socialWork, docData}) => {


    return <> 
    {socialWork !== 'dosuba' ?
        <main id='constancy'>
            <aside className='date-img'>
                <img src={UMA_LOGO} className='uma-img' alt='logo de Uma' />
                <p>Buenos Aires,</p>
                <p>{att && moment(att.mr.dt_cierre).format("DD-MM-YYYY HH:mm")}</p>
            </aside>
            <p className='constancy-content'>A quien corresponda:</p>
                <p>Se deja constancia que el día {att && moment(att.mr.dt_cierre).format('DD-MM-YYYY') }, el/la Sr/Sra. {att && att.patient.fullname} (DNI {att && att.patient.dni})
                &nbsp; fue asistido/a a través de nuestro servicio de consultas por el médico {docData.fullname || ''} {docData.matricula && `(Matrícula ${docData.matricula})`}.</p>
            {att.mr.diagnostico && 
                <section className="diagnosis">
                    <p className="constancy-diagnosis">Diagnóstico presuntivo:</p>
                    <p>{att.mr.diagnostico && att.mr.diagnostico.slice(0, -5)}</p>
                    {att && att.mr && att.mr.reposo && att.mr.reposo.toLowerCase() !== 'no' ? 
                    <p> Se sugiere reposo de {att.mr.reposo} hs.</p> : ''}
                    {att && att.mr && att.mr.receta.map(item => {
                        return(
                            <section className="medication">
                                <p>Medicación:</p>
                                <p>{item.drugName}</p>
                            </section>
                        )
                    })}
                </section>
            }
            <section className="text-emergencias">
                <p>Sin otro particular, saludamos muy atte.</p>
                <p>Emergencias</p>
                <p>Dirección Médica.</p>
            </section>
            <section className='verify-attention'>
                <div>
                    <p>Verifique la atención en: </p>
                    <a href='http://uma-health.com/att'>http://uma-health.com/att</a>
                </div>
                <p>Código:</p>
                <p>{btoa(att.assignation_id).slice(0, -2)}</p>
            </section>
            <div className='qr-code'>
                <QRCode value={`http://uma-health.com/att/${att.patient.dni}/${btoa(att.assignation_id)}`} />
            </div>
        </main>
        :
        <p className='not-available'>
            No disponible.
        </p>
    }
</>
}

export default Constancia;