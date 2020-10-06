import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import ReactToPrint from 'react-to-print';
import UMA from '../../../assets/icons/icon-168.png';

class RecipePDFCL extends React.Component {
	componentDidMount() {
		const { prescriptionNumber } = this.props;
		const canvasRecipe = document.getElementById('barcodeRecipeToPrint');
		if (!!prescriptionNumber) {
			canvasRecipe &&
				JsBarcode(canvasRecipe, prescriptionNumber, {
					format: 'EAN13',
					width: 3,
					height: 50,
					fontSize: 20,
					flat: true,
				});
		}
	}
	render() {
		const { patient, doctorInfo, recipe, direccion } = this.props;
		return (
			<div>
				<div className='recipeToPrint'>
					<div className='recipeToPrint__container logo_container'>
						<img src={UMA} className='recipeToPrint__container--logo' alt='' />
					</div>
					<div className='recipeToPrint__container'>
						<h1 className='recipeToPrint__container--title'>Receta Médica</h1>
					</div>
					<div className='recipeToPrint__container mt-5'>
						<h4>
							<b>Datos Paciente: </b>
						</h4>
						<ul className='recipeToPrint__container--list'>
							{patient && <li>Nombre completo: {patient.fullname}</li>}
							{recipe && recipe.medicines && recipe.medicines[0] && (
								<li>Fecha de emisión: {recipe.medicines[0].prescriptionDate}</li>
							)}
							{patient.dni && <li>RUT: {patient.dni}</li>}
							{patient.sex && <li>Sexo: {patient.sex === 'M' ? 'MASCULINO' : 'FEMENINO'}</li>}
							{patient.dob && <li>Fecha de nacimiento: {patient.dob}</li>}
							{direccion && <li>Dirección: {direccion}</li>}
						</ul>
					</div>
					<div className='recipeToPrint__container'>
						<h4>
							<b>Rp:</b>
						</h4>
						{recipe.map((medicine, index) => (
							<div key={index} className='recipeToPrint__container--recipeItem'>
								<p>
									Cantidad: <b>{medicine.cantidad}</b> <br />
									Producto/Principio Activo: <b>{medicine.productName}</b> <br />
									Indicaciones: <b>{medicine.indicaciones}</b>
								</p>
							</div>
						))}
					</div>
					<div className='recipeToPrint__bottomContainer'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='recipeToPrint__bottomContainer--barcode position_center'>
								<h6>Número de receta</h6>
								<div>
									<canvas
										id='barcodeRecipeToPrint'
										style={{
											display: 'block',
										}}
									/>
								</div>
							</div>
						</div>
						<h6 className='recipeToPrint__bottomContainer--doctorData'>
							{!!doctorInfo && <span>Médico: {doctorInfo.fullname}</span>}
						</h6>
						<h6 className='recipeToPrint__bottomContainer--doctorData'>
							{!!doctorInfo && <span>Matrícula número: {doctorInfo.matricula}</span>}
						</h6>
						<div className='recipeToPrint__bottomContainer--firm'>
							{!!doctorInfo.signature && <img src={doctorInfo.signature} alt='Firma del doctor' />}
						</div>
						<div className='recipeToPrint__bottomContainer--mail'>
							<span>Contacto: info@uma-health.com</span>
							<span>{doctorInfo.prov_street}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const Recipe = ({ att, doc }) => {
	const { mr = {}, patient = {} } = att;
	const compRef = useRef();
	const [prescripNum] = useState(() => {
		if (mr?.receta[0]?.prescriptionNumber) {
			return mr.receta[0].prescriptionNumber;
		} else if (mr?.receta[0]?.prescripNumber) {
			return mr.receta[0].prescripNumber;
		} else {
			return '';
		}
	});
	const [prescripDate] = useState(mr?.receta[0]?.prescriptionDate);
	const [direccion] = useState(mr?.receta[0]?.direccion);
	const dataToPrint = {
		patient: patient,
		recipe: mr.receta,
		doctorInfo: doc,
		ref: compRef,
		prescriptionNumber: prescripNum || '',
		prescriptionDate: prescripDate || '',
		mr,
		direccion,
	};

	useEffect(() => {
		if (mr?.receta[0]) {
			try {
				const cvRecipe = document.getElementById('barcodeRecipe');
				if (!!prescripNum) {
					JsBarcode(cvRecipe, prescripNum, {
						format: 'EAN13',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				}
			} catch (error) {
				// console.error(error)
			}
		}
	}, []);

	return (
		<>
			{mr?.receta[0] ? (
				<div className='d-flex flex-column justify-content-between p-2' id='receta'>
					<h3 className='text-center'>Receta médica</h3>
					<div className='dossier-att-info'>
						<p>
							<b>Paciente: </b>
							{patient && patient.fullname}
						</p>
						<p>
							<b>RUT: </b>
							{patient && patient.dni}
						</p>
						<hr />
						<p>
							<b>Fecha de emisión</b>
							<br />
							{mr.dt_cierre}
						</p>
						<hr />
						<div>
							<b>Producto(s):</b>
							<br />
							{mr.receta.map((item, index) => (
								<ul key={index}>
									<li>Producto/Droga: {item.productName}</li>
									<li>Cantidad: {item.cantidad}</li>
									<li>Indicaciones: {item.indicaciones}</li>
									{mr.receta.length >= 2 && <li>---------------------------------</li>}
								</ul>
							))}
						</div>
						<hr />
						<p>
							<b>Diagnóstico: </b>
							<span>{mr.diagnostico}</span>
						</p>
						<hr />
						<p>
							<b>Médico</b>
							<br />
						</p>
						<span className='dossier-doctor-name'>Nombre: {doc.fullname} </span>
						<br />
						{doc.matricula && (
							<>
								<span className='dossier-doctor-enroll'>Matrícula: {doc.matricula} </span>
								<br />
							</>
						)}
						<span className='w-100 ml-5 text-center'>
							{doc.signature && doc.signature !== '' && (
								<img className='ml-5 w-25' src={doc.signature} alt='signature' />
							)}
						</span>
						<hr />
						<div className='text-center'>
							<div className='orderToPrint__bottomContainer--barcode w-100'>
								<h4>
									<b>Número de receta</b>
								</h4>
								<div className='w-100'>
									<canvas className='w-100' id='barcodeRecipe' style={{ display: 'block' }} />
								</div>
							</div>
						</div>
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
					<div className='d-none'>
						<RecipePDFCL {...dataToPrint} />
					</div>
				</div>
			) : (
				<p className='text-center mt-5 mb-5'>No se adjuntó receta.</p>
			)}
		</>
	);
};

export default Recipe;
