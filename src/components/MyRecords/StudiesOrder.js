import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import '../../styles/orders.scss';

class OrderPDF extends React.Component {
    render() {
        const { patient, doctorInfo, mr } = this.props
        return (
            <div className='orderToPrint'>
                <div className='orderToPrint__container'>
                    <img src={UMA_LOGO} className='orderToPrint__container--logo' alt='' />
                </div>
                <div className='orderToPrint__container'>
                    <h1 className='orderToPrint__container--title'>Órdenes de estudio</h1>
                </div>
                <div className='orderToPrint__container'>
                    <ul className='orderToPrint__container--list'>
                        <li>Nombre completo: {patient && patient.fullname}</li>
                        {patient && patient.obra_social && <li>Obra Social: {patient.obra_social}</li>}
                        {patient && patient.n_afiliado && <li>Número de afiliado: {patient.n_afiliado}</li>}
                        {mr && mr.dt_cierre && <li>Fecha: {mr.dt_cierre.split(' ')[0]}</li>}
                        {mr && mr.diagnostico && <li>Diagnóstico: {mr.diagnostico} </li>}
                    </ul>
                </div>
                <div className="orderToPrint__container mt-5">
                    <h2>Estudios:</h2>
                    <ul className="orderToPrint__container--list mt-2">
                        {mr.ordenes.map((item, index) => <li key={index}>{item.nombre}</li>)}
                    </ul>
                </div>
                <div className='orderToPrint__bottomContainer'>
                    <h6 className='orderToPrint__bottomContainer--doctorData'>
                        Médico: {doctorInfo && doctorInfo.fullname}
                    </h6>
                    <h6 className='orderToPrint__bottomContainer--doctorData'>
                        Matrícula número: {doctorInfo && doctorInfo.matricula}
                    </h6>
                    {doctorInfo.signature && doctorInfo.signature !== "" &&
                        <div className='orderToPrint__bottomContainer--firm'>
                            <img src={doctorInfo.signature} alt='' />
                        </div>}
                    <div className='orderToPrint__bottomContainer--mail mt-2'>
                        info@uma-health.com <br/>
												ORDEN DE ESTUDIOS DE EMERGENCIA COVID-19
                    </div>
                </div>
            </div>
        )
    }
}


function StudiesOrder({ att, doc }) {
    const { mr, patient } = att
    const compRef = useRef()
    const dataToPrint = {
        patient: patient,
        doctorInfo: doc,
        ref: compRef,
        mr
    }
    return (
        <>
            {!!att && !!mr && !!mr.ordenes && mr.ordenes.length > 0 ?
                <>
                    <div className='d-flex flex-column justify-content-between p-2' id='receta' ref={compRef}>
                        <h3 className='text-center mt-2'>Órdenes de estudio</h3>
                        <div className='dossier-att-info'>
                            <p><b>Afiliado: </b>{patient && patient.fullname}</p>
                            <p><b>DNI: </b>{patient && patient.dni}</p>
                            <hr />
                            <p><b>Fecha de prescripción</b><br />{mr.dt_cierre}</p>
                            <hr />
                            {(patient && 'obra_social' in patient && patient.obra_social) &&
                                <p><b>Obra social</b> {patient.obra_social}</p>}
                            {(patient && 'n_afiliado' in patient && patient.n_afiliado) &&
                                <p><b>Número de afiliado</b> {patient.n_afiliado}</p>}
                            <p><b>Diagnóstico:</b> {mr.diagnostico}</p>
                            <div>
                                <b>Estudios:</b><br />
                                <ul>
                                    {mr.ordenes.map((item, index) => <li key={index}>Nombre: {item.nombre}</li>)}
                                </ul>
                            </div>
                            <hr />
                            <p><b>Médico</b><br /></p>
                            <span className='dossier-doctor-name'>Nombre: {doc.fullname || ''} </span><br />
                            <span className='dossier-doctor-enroll'>Matrícula: {doc.matricula || ''} </span><br />
                        </div>
                    </div>
                    <div className='d-none'>
                        <OrderPDF {...dataToPrint} />
                    </div>
                    <ReactToPrint
                        trigger={() => (
                            <div className='d-flex justify-content-around'>
                                <div className='d-flex justify-content-center btn btn-blue-lg'>
                                    <div className='patient-action'>Descargar</div>
                                </div>
                            </div>
                        )}
                        content={() => compRef.current}
                    />
                </>
                :
                <div className='w-100 text-center mt-5'>
                    No se adjuntaron órdenes de estudios.
        </div>
            }
        </>
    )
}

export default StudiesOrder;





