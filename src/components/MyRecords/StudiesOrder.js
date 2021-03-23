import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import UMA_LOGO from '../../assets/icons/icon-168.png';
import moment from 'moment-timezone';
import db from '../../config/DBConnection';
import '../../styles/orders.scss';

class OrderPDF extends React.Component {
    render() {
        const { patient, doctorInfo, mr, indications } = this.props
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
                            {indications && indications !== "" && <div className='orderToPrint__container mt-5'>
                                    <hr />
                                    <h2>Indicaciones:</h2>
                                    <span>{indications}</span>
                                    <hr />
							</div>}
							<div className='orderToPrint__container mt-5'>
									<h2>Estudios:</h2>
									<ul className='orderToPrint__container--list mt-2'>
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
									{doctorInfo.signature && doctorInfo.signature !== '' &&
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
    const firebase = db.firestore();
    const { mr, patient } = att
    const [order, setOrder] = useState({ indications: '' })
    const compRef = useRef()
    const dataToPrint = {
        patient: patient,
        doctorInfo: doc,
        ref: compRef,
        mr,
        indications: order.indications || ''
    }

    useEffect(() => {
        if(att?.uid) {
            firebase.collection(`events/orders/AR`)
                .where('uid', '==', att.uid)
                .get()
                .then(snap => {
                    snap.forEach((el) => {
                        setOrder(el.data())
                    })
                })
        }
    }, [mr])

    return (
        <>
            {!!att && !!mr && !!mr.ordenes && mr.ordenes.length > 0 ?
                <>
                    <div id='receta' ref={compRef}>
                        <div className='dossier-att-info'>
                            <p><b>Afiliado: </b></p>
                            <span className='dossier-info'>{patient && patient.fullname}</span>
                            <hr />
                            <p><b>Documento: </b></p>
                            <span className='dossier-info'>{patient && patient.dni}</span>
                            <hr />
                            <div className='date-prescription'>
                                <div>
                                    <p><b>Fecha de prescripción:</b></p>
                                    <span className='dossier-info'>{att && moment(mr.dt_cierre).format('DD-MM-YYYY')}</span>
                                </div>
                                <div>
                                    <p><b>Hora de prescripción:</b></p>
                                    <span className='dossier-info'>{att && moment(mr.dt_cierre).format('HH:mm')}</span>
                                </div>
                            </div>
                            <hr />
                            {(patient && 'obra_social' in patient && patient.obra_social) &&
                                <>
                                    <p><b>Cobertura de salud:</b> </p>
                                    <span className='dossier-info'>{patient.obra_social}</span>
                                    <hr />
                                </>
                            }
                            {(patient && 'n_afiliado' in patient && patient.n_afiliado) &&
                                <>
                                    <p><b>Número de afiliado:</b></p> 
                                    <span className='dossier-info'>{patient.n_afiliado}</span>
                                    <hr/>
                                </>
                            }
                            {order.indications && order.indications !== "" && <div>
                                <p><b>Indicaciones:</b></p>
                                <span className='dossier-info'>{order.indications}</span>
                                <hr />
                            </div>}
                            <p><b>Diagnóstico</b></p>
                            <span className='dossier-info'>{mr.diagnostico}</span> 
                            <hr/>
                            <div>
                                <b>Estudio</b><br />
                                <ul>
                                    {mr.ordenes.map((item, index) => <li className='dossier-info' key={index}>Nombre: {item.nombre}</li>)}
                                </ul>
                            </div>
                            <p><b>Médico</b><br /></p>
                            <span className='dossier-doc-info'><b>Nombre: </b> {doc.fullname || ''} </span><br />
                            <span className='dossier-doc-info'><b>Matrícula: </b> {doc.matricula || ''} </span><br />
                            <span className='dossier-doc-info'><b>Firma: </b> </span> <br />
                            <div className='doctor-signature'>
                                <img src={dataToPrint.doctorInfo.signature} alt='doctor signature' style={{width: '200px', }}/>
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'none'}}>
                        <OrderPDF {...dataToPrint} />
                    </div>
                    <ReactToPrint
                        trigger={() => (
                            <div className='download-order'>
                                <button className='patient-action button-d'>
                                    Descargar orden
                                </button>
                            </div>
                        )}
                        content={() => compRef.current}
                    />
                </>
                :
                <div className='no-orders'>
                    No se adjuntaron órdenes de estudios.
                </div>
            }
        </>
    )
}

export default StudiesOrder;





