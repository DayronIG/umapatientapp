/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import JsBarcode from 'jsbarcode';
import ReactToPrint from 'react-to-print';
import UMA from '../../../assets/icons/icon-168.png';
import './../../../styles/orders.scss';

class RecipePDF extends React.Component {
	componentDidMount() {
		const {
			prescriptionNumber,
			patient: { n_afiliado },
			recipe
		} = this.props;
		for (let i = 0; i <= recipe.length; i++) {
			const cvRecipe = document.getElementById(`barcodeRecipe_${i}`),
				cvRecipe_rep = document.getElementById(`barcodeRecipe_rep_${i}`),
				cvAff = document.getElementById(`barcodeAffiliate_${i}`),
				cvAff_rep = document.getElementById(`barcodeAffiliate_rep_${i}`);
			if (!!prescriptionNumber) {
				cvRecipe &&
					JsBarcode(cvRecipe, prescriptionNumber, {
						format: 'EAN13',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				cvRecipe_rep &&
					JsBarcode(cvRecipe_rep, prescriptionNumber, {
						format: 'EAN13',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
			}
			if (!!n_afiliado) {
				cvAff &&
					JsBarcode(cvAff, n_afiliado, {
						format: 'CODE128',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				cvAff_rep &&
					JsBarcode(cvAff_rep, n_afiliado, {
						format: 'CODE128',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
			}
		}
	}

	render() {
		const { patient, recipe, doctorInfo, prescriptionDate, mr, logo } = this.props;
		let printTimes = 0, printArr = [];
		let helper = recipe.length;
		if (helper === 1) {
			printTimes = 1;
		} else if (helper % 2 === 0) {
			printTimes = helper / 2;
		} else if (helper % 2 !== 0) {
			printTimes = helper / 2 + 1;
		} else {
			printTimes = 0;
		}
		for (let i = 1; i <= printTimes; i++) {
			printArr.push(i);
		}
		if (printArr.length > 0 && recipe?.[0]) {
			return (
				<div>
					{printArr.map((item, i) => {
						let replicate,
							mapMeds = [];
						if (i === 0) {
							mapMeds.push(recipe[i]);
							if (recipe[i + 1]) {
								mapMeds.push(recipe[i + 1]);
							}
						} else if (i === 1) {
							if (recipe[i + 1]) {
								mapMeds.push(recipe[i + 1]);
							}
							if (recipe[i + 2]) {
								mapMeds.push(recipe[i + 2]);
							}
						} else {
							if (recipe[i + 2]) {
								mapMeds.push(recipe[i + 2]);
							}
							if (recipe[i + 3]) {
								mapMeds.push(recipe[i + 3]);
							}
						}
						if (mapMeds?.[0]) {
							replicate = mapMeds.some((med) => parseInt(med.duplicado) === 1);
						}
						return (
							<>
								<div className='recipeToPrint'>
									<div className='recipeToPrint__container logo_container'>
										<img src={logo || UMA} className='recipeToPrint__container--logo' alt='' />
									</div>
									{/*<div className='recipeToPrint__container'>
										<h1 className='recipeToPrint__container--title'>
											Receta Médica
										</h1>
										</div>*/}
									<div className='recipeToPrint__container'>
										<ul className='recipeToPrint__container--list'>
											<li>Nombre completo: {patient.fullname}</li>
											{mr.diagnostico &&
												<li>Diagnóstico: {mr.diagnostico}</li>
											}
											<li>Fecha de prescripción: {prescriptionDate}</li>
											{patient.obra_social &&
												<li>Obra Social: {patient.obra_social}</li>
											}
											{patient.n_afiliado &&
												<li>Número de afiliado: {patient.n_afiliado}</li>
											}
											{patient.dni &&
												<li>Dni del paciente: {patient.dni}</li>
											}
										</ul>
									</div>
									<div className='recipeToPrint__container'>
										<table className='recipeToPrint__container--table'>
											<thead>
												<tr>
													<th>Cantidad</th>
													<th>Producto</th>
													<th>Presentación</th>
													<th>Droga</th>
												</tr>
											</thead>
											<tbody>
												{mapMeds.map((medicine, index) => (
													<tr key={index}>
														<td>{medicine.cantidad}</td>
														<td>{medicine.productName}</td>
														<td>{medicine.presentationName}</td>
														<td>{medicine.drugName}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									<div className='recipeToPrint__bottomContainer'>
										<div className='d-flex justify-content-between align-items-center'>
											<div
												className={
													!!patient.n_afiliado
														? 'recipeToPrint__bottomContainer--barcode'
														: 'recipeToPrint__bottomContainer--barcode position_center'
												}>
												<h6>Número de receta</h6>
												<div>
													<canvas id={`barcodeRecipe_${i}`} />
												</div>
											</div>
											{!!patient.n_afiliado ? (
												<div className='recipeToPrint__bottomContainer--barcode'>
													<h6>Número de afiliado</h6>
													<div>
														<canvas id={`barcodeAffiliate_${i}`} />
													</div>
												</div>
											) : (
													<canvas id='barcodeAffiliate' style={{ display: 'none' }} />
												)}
										</div>
										<h6 className='recipeToPrint__bottomContainer--doctorData'>
											{!!doctorInfo && <span>Médico: {doctorInfo.fullname}</span>}
										</h6>
										<h6 className='recipeToPrint__bottomContainer--doctorData'>
											{!!doctorInfo && <span>Matrícula número: {doctorInfo.matricula}</span>}
										</h6>
										<div className='recipeToPrint__bottomContainer--firm'>
											{!!doctorInfo.signature && (
												<img src={doctorInfo.signature} alt='Firma del doctor' />
											)}
										</div>
										<div className='recipeToPrint__bottomContainer--mail'>
											<span>Contacto: info@uma-health.com - 0800-888-3637</span>
											<br />
											<span>Dirección: Melián 2752</span>
											<br />
											<span>Válida por 7 días a partir de la fecha de emisión.</span>
											<br /> <br />
											<small className='pl-2'>RECETA DE EMERGENCIA COVID-19</small>
										</div>
									</div>
								</div>
								{replicate && (
									<div className='recipeToPrint'>
										<div className='recipeToPrint__container logo_container'>
											<img
												src={logo || UMA}
												className='recipeToPrint__container--logo'
												alt=''
											/>
										</div>
										<div className='recipeToPrint__container'>
											<h5>
												<b>DUPLICADO</b>
											</h5>
										</div>
										{/* <div className='recipeToPrint__container'>
											<h1 className='recipeToPrint__container--title'>Receta Médica</h1>
											</div>*/}
										<div className='recipeToPrint__container'>
											<ul className='recipeToPrint__container--list'>
												{patient &&
													<li>Nombre completo: {patient.fullname}</li>
												}
												{mr.diagnostico &&
													<li>Diagnóstico: {mr.diagnostico}</li>
												}
												<li>Fecha de prescripción: {prescriptionDate}</li>
												{patient.obra_social &&
													<li>Obra Social: {patient.obra_social}</li>
												}
												{patient.n_afiliado &&
													<li>Número de afiliado: {patient.n_afiliado}</li>
												}
												{patient.dni && <li>Dni del paciente: {patient.dni}</li>}
											</ul>
										</div>
										<div className='recipeToPrint__container'>
											<table className='recipeToPrint__container--table'>
												<thead>
													<tr>
														<th>Cantidad</th>
														<th>Producto</th>
														<th>Presentación</th>
														<th>Droga</th>
													</tr>
												</thead>
												<tbody>
													{mapMeds.map((medicine, index) => {
														if (parseInt(medicine.duplicado) === 1) {
															return (
																<tr key={index}>
																	<td>{medicine.cantidad}</td>
																	<td>{medicine.productName}</td>
																	<td>{medicine.presentationName}</td>
																	<td>{medicine.drugName}</td>
																</tr>
															);
														} else {
															return null
														}
													})}
												</tbody>
											</table>
										</div>
										<div className='recipeToPrint__bottomContainer'>
											<div className='d-flex justify-content-between align-items-center'>
												<div
													className={
														!!patient.n_afiliado
															? 'recipeToPrint__bottomContainer--barcode'
															: 'recipeToPrint__bottomContainer--barcode position_center'
													}>
													<h6>Número de receta</h6>
													<div>
														<canvas id={`barcodeRecipe_rep_${i + 1}`} />
													</div>
												</div>
												{!!patient.n_afiliado ? (
													<div className='recipeToPrint__bottomContainer--barcode'>
														<h6>Número de afiliado</h6>
														<div>
															<canvas id={`barcodeAffiliate_rep_${i + 1}`} />
														</div>
													</div>
												) : (
														<canvas id='barcodeAffiliate_rep' style={{ display: 'none' }} />
													)}
											</div>
											<h6 className='recipeToPrint__bottomContainer--doctorData'>
												{!!doctorInfo && <span>Médico: {doctorInfo.fullname}</span>}
											</h6>
											<h6 className='recipeToPrint__bottomContainer--doctorData'>
												{!!doctorInfo &&
													<span>Matrícula número: {doctorInfo.matricula}</span>
												}
											</h6>
											<div className='recipeToPrint__bottomContainer--firm'>
												{!!doctorInfo.signature && (
													<img src={doctorInfo.signature} alt='Firma del doctor' />
												)}
											</div>
											<div className='recipeToPrint__bottomContainer--mail'>
												<span>Contacto: info@uma-health.com - 0800-888-3637</span>
												<br />
												<span>Dirección: Melián 2752</span>
												<br />
												<span>Válida por 7 días a partir de la fecha de emisión.</span>
												<br /> <br />
												<small className='pl-2'>RECETA DE EMERGENCIA COVID-19</small>
											</div>
										</div>
									</div>
								)}
							</>
						);
					})}
				</div>
			);
		} else {
			return <div></div>;
		}
	}
}
class RecipePDFUP extends React.Component {
	componentDidMount() {
		for (let i = 0; i < this.props.recipe.length; i++) {
			const canvasAffiliate = document.getElementById(`barcodeAffiliateUP_${i}`)
			const canvasAffiliate_rep = document.getElementById(`barcodeAffiliateUP_rep_${i}`)
			if (!!this.props.prescriptionNumber) {
				canvasAffiliate && JsBarcode(canvasAffiliate, this.props.prescriptionNumber, {
					format: 'CODE128', width: 3, height: 50, fontSize: 20, flat: true
				})
				canvasAffiliate_rep && JsBarcode(canvasAffiliate_rep, this.props.prescriptionNumber, {
					format: 'CODE128', width: 3, height: 50, fontSize: 20, flat: true
				})
			}
		}
	}
	render() {
		const { prescriptionNumber, prescriptionDate, patient, recipe, doctorInfo, mr } = this.props
		const replicate = recipe.some(med => parseInt(med.duplicado) === 1)
		let nAff = patient.n_afiliado
		let printTimes = 0, printArr = [];
		let helper = recipe.length;
		if (!!nAff && nAff.length === 10) {
			nAff = `${nAff}0`
		} else if (!!nAff && nAff.length < 10) {
			while (nAff.length < 10) {
				nAff = `0${nAff}`
			}
			nAff = `${nAff}0`
		}
		if (helper === 1) {
			printTimes = 1;
		} else if (helper % 2 === 0) {
			printTimes = helper / 2;
		} else if (helper % 2 !== 0) {
			printTimes = helper / 2 + 1;
		} else {
			printTimes = 0;
		}
		for (let i = 1; i <= printTimes; i++) {
			printArr.push(i);
		}
		if (printArr.length > 0 && recipe[0]) {
			return (
				<div>
					{printArr.map((item, i) => {
						let replicate,
							mapMeds = [];
						if (i === 0) {
							mapMeds.push(recipe[i]);
							if (recipe[i + 1]) {
								mapMeds.push(recipe[i + 1]);
							}
						} else if (i === 1) {
							if (recipe[i + 1]) {
								mapMeds.push(recipe[i + 1]);
							}
							if (recipe[i + 2]) {
								mapMeds.push(recipe[i + 2]);
							}
						} else {
							if (recipe[i + 2]) {
								mapMeds.push(recipe[i + 2]);
							}
							if (recipe[i + 3]) {
								mapMeds.push(recipe[i + 3]);
							}
						}
						if (mapMeds[0]) {
							replicate = mapMeds.some((med) => parseInt(med.duplicado) === 1);
						}
						return (
							<>
								<div className='recipeToPrintUp'>
									<div className='recipeToPrintUp__container'>
										<div className='recipeToPrintUp__container--title'>
											<img src={UMA} />
										</div>
										<div className='recipeToPrintUp__container--recipeData'>
											{prescriptionNumber &&
												<div className='barcodeContainer'>
													<canvas id={`barcodeAffiliateUP_${i}`}></canvas>
												</div>}
											<div className='mt-4'>
												{prescriptionNumber && <span>Nro. Receta:{prescriptionNumber}</span>}
											</div>
										</div>
									</div>
									<div className='recipeToPrintUp__container'>
										<div className='recipeToPrintUp__container--recipeResume'>
											{!!patient.fullname && <p><span>Paciente: </span><b>{patient.fullname}</b></p>}
											{!!patient.dni && <p><span>DNI: </span><b>{patient.dni}</b></p>}
											{!!patient.obra_social && <p><span>Convenio: </span><b>{patient.obra_social}</b></p>}
											{!!nAff && <p><span>Nro. Afiliado: </span><b>{nAff}</b></p>}
										</div>
										<div className='recipeToPrintUp__container--recipeResume'>
											{!!patient.dob && <p><span>Fecha Nac.: </span><b>{patient.dob}</b></p>}
										</div>
									</div>
									<div className='recipeToPrintUp__container'>
										<div className='recipeToPrintUp__container--recipeData'>
											<h1><b>Rp/</b></h1>
											{mapMeds.map((medicine, index) => (
												<p className='pl-4' key={index}>
													<span>
														{medicine.productName} - {medicine.drugName} - {medicine.presentationName}
													</span> <br />
													<span> Cantidad del envase:{medicine.cantidad}</span> <br />
												</p>
											))}
											{mapMeds[0] && mapMeds[0].indicaciones &&
												<>
													<h1 className='mt-5'><b>INDICACIONES</b></h1>
													{mapMeds.map((medicine, index) => (
														<p className='pl-4' key={index}><span>{medicine.indicaciones}</span></p>
													))}
												</>
											}
										</div>
									</div>
									<div className='recipeToPrintUp__container'>
										<div className='recipeToPrintUp__containerBottom'>
											<div className='recipeToPrintUp__containerBottom--doctorData'>
												<p><b>Diagnóstico:</b><li>{mr.diagnostico}</li></p>
												<p><span>Fecha: <b>{prescriptionDate}</b></span>
												</p>
											</div>
											<div className='recipeToPrintUp__containerBottom--doctorData'>
												{!!doctorInfo.signature && <img src={doctorInfo.signature} alt='firma del doctor' />}
												{!!doctorInfo.fullname &&
													<p><span>Médico: <b>{doctorInfo.fullname}</b> </span></p>}
												{!!doctorInfo.matricula &&
													<p><span>Matrícula número: <b>{doctorInfo.matricula}</b></span> </p>}
											</div>
										</div>
										<div className='recipeToPrintUp__containerBottom'>
											<span>info@uma-health.com</span>
										</div>
									</div>
								</div>

								{replicate &&
									<div className='recipeToPrintUp'>
										<div className='recipeToPrintUp__container '>
											<h4 className='font-weight-bold text-uppercase'>Duplicado</h4>
										</div>
										<div className='recipeToPrintUp__container'>
											<div className='recipeToPrintUp__container--title'>
												<img src={UMA} />
											</div>
											<div className='recipeToPrintUp__container--recipeData'>
												{!!prescriptionNumber &&
													<div className='barcodeContainer'>
														<canvas id={`barcodeAffiliateUP_rep_${i}`} />
													</div>}
												<div className='mt-4'>
													{!!prescriptionNumber && <span>Nro. Receta: {prescriptionNumber}</span>}
												</div>
											</div>
										</div>
										<div className='recipeToPrintUp__container'>
											<div className='recipeToPrintUp__container--recipeResume'>
												{!!patient.fullname && <p><span>Paciente: </span><b>{patient.fullname}</b></p>}
												{!!patient.dni && <p><span>DNI: </span><b>{patient.dni}</b></p>}
												{!!patient.obra_social && <p><span>Convenio: </span><b>{patient.obra_social}</b></p>}
												{!!nAff && <p><span>Nro. Afiliado: </span><b>{nAff}</b></p>}
											</div>
											<div className='recipeToPrintUp__container--recipeResume'>
												{!!patient.dob && <p><span>Fecha Nac.: </span><b>{patient.dob}</b></p>}
											</div>
										</div>
										<div className='recipeToPrintUp__container'>
											<div className='recipeToPrintUp__container--recipeData'>
												<h1><b>Rp/</b></h1>
												{mapMeds.map((medicine, index) => {
													if (parseInt(medicine.duplicado) === 1) {
														return (
															<p className='pl-4' key={index}>
																<span>
																	{medicine.productName} - {medicine.drugName} - {medicine.presentationName}
																</span> <br />
																<span> Cantidad del envase:{medicine.cantidad}</span> <br />
															</p>
														)
													}
												})}
												{mapMeds[0] && mapMeds[0].indicaciones &&
													<>
														<h1 className='mt-5'><b>INDICACIONES</b></h1>
														{recipe.map((medicine, index) => {
															if (parseInt(medicine.duplicado) === 1) {
																return <p className='pl-4' key={index}><span>{medicine.indicaciones}</span></p>
															}
														})}
													</>
												}
											</div>
										</div>
										<div className='recipeToPrintUp__container'>
											<div className='recipeToPrintUp__containerBottom'>
												<div className='recipeToPrintUp__containerBottom--doctorData'>
													<p><b>Diagnóstico:</b><li>{mr.diagnostico}</li></p>
													<p><span>Fecha: <b>{prescriptionDate}</b></span>
													</p>
												</div>
												<div className='recipeToPrintUp__containerBottom--doctorData'>
													{!!doctorInfo.signature && <img src={doctorInfo.signature} alt='firma del doctor' />}
													{!!doctorInfo.fullname &&
														<p><span>Médico: <b>{doctorInfo.fullname}</b> </span></p>}
													{!!doctorInfo.matricula &&
														<p><span>Matrícula número: <b>{doctorInfo.matricula}</b></span> </p>}
												</div>
											</div>
											<div className='recipeToPrintUp__containerBottom'>
												<span>info@uma-health.com</span>
											</div>
										</div>
									</div>
								}
							</>
						)
					})}
				</div>
			)
		}
	}
}

const Recipe = ({ att, doc }) => {
	const { mr, patient } = att;
	const compRef = useRef();
	const [prescripNum] = useState(() => {
		if (mr?.receta?.[0]?.prescriptionNumber) {
			return mr.receta?.[0].prescriptionNumber;
		} else if (mr?.receta?.[0]?.prescripNumber) {
			return mr.receta[0].prescripNumber;
		} else {
			return '';
		}
	});
	const [fromUP] = useState(prescripNum?.length > 13 ? true : false);
	const [prescripDate] = useState(mr?.receta?.[0]?.prescriptionDate ? mr.receta[0].prescriptionDate : '');
	const dataToPrint = {
		patient,
		mr,
		recipe: mr.receta,
		logo: mr.receta?.[0]?.selected_logo,
		doctorInfo: doc,
		ref: compRef,
		prescriptionNumber: prescripNum || '',
		prescriptionDate: prescripDate || '',
	};

	useEffect(() => {
		if (mr?.receta?.[0]) {
			try {
				const cvRecipe = document.getElementById('barcodeRecipe');
				const canvasAffiliate = document.getElementById('barcodeAffiliate');
				if (fromUP && !!prescripNum) {
					JsBarcode(cvRecipe, prescripNum, {
						format: 'CODE128',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				} else if (!!prescripNum) {
					JsBarcode(cvRecipe, prescripNum, {
						format: 'EAN13',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				}
				if (!!patient.n_afiliado) {
					JsBarcode(canvasAffiliate, patient.n_afiliado, {
						format: 'CODE128',
						width: 3,
						height: 50,
						fontSize: 20,
						flat: true,
					});
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, []);

	return (
		<>
			{mr?.receta?.[0] ? ( 
				<div className='d-flex flex-column justify-content-between p-2' id='receta'>
					<div className='dossier-att-info'>
						<p>
							<b>Afiliado: </b>
						</p>
						<span className='dossier-info'>{patient && patient.fullname}</span>
						<hr/>
						<p>
							<b>DNI: </b>
						</p>
						<span className='dossier-info'>{patient && patient.dni}</span>
						<hr />
						
						<div className="d-flex justify-content-between">
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
						
						{patient && 'obra_social' in patient && patient?.obra_social && (
							<>
								<p>
									<b>Obra social:</b> 
								</p>
								<span className='dossier-info'>{patient.obra_social}</span>
								<hr/>
							</>
						)}
						{patient && 'n_afiliado' in patient && patient?.n_afiliado && (
							<>
								<p>
									<b>Número de afiliado:</b> 
								</p>
								<span className='dossier-info'>{patient.n_afiliado}</span>
								<hr/>
							</>
						)}
						{mr.diagnostico && (
							<>
								<p>
									<b>Diagnóstico:</b>
								</p>
								<span className='dossier-info'>{mr.diagnostico}</span>
								<hr />
							</>
						)}
						<p>
							<b>Médico</b>
							<br />
						</p>
						<span className='dossier-doc-info'><b>Nombre: </b> {doc.fullname || ''} </span>
						<br />
						{doc.matricula && (
							<>
								<span className='dossier-doc-info'><b>Matrícula: </b>{doc.matricula} </span>
								<br />
							</>
						)}
						<p><b>Firma:</b></p>
						<span className='w-100 ml-5 text-center'>
							{doc.signature && doc.signature !== '' && <img className='ml-5 w-50' src={doc.signature} alt='signature' />}
						</span>
						<div className="mt-4">
							<p><b>Medicación prescripta:</b></p>
							<div className="modal-medicacion">
								{mr.receta.map((item, index) => {
									return (
										<ul key={index}>
											<li>Producto:</li>
											<li>{item.productName}</li>
											<hr/>
											<li>Droga:</li> 
											<li>{item.drugName}</li>
											<hr/>
											<li>Cantidad:</li>
											<li>{item.cantidad}</li>
											<hr/>
											<li>Presentación: </li>
											<li>{item.presentationName}</li>
											<hr/>
											<li>Indicaciones: </li>
											<li>{item.indicaciones}</li>
											{mr.receta.length >= 2 && <li>---------------------------------</li>}
											<hr/>
										</ul>
									);
								})}
							</div>
							<ul className="mt-4">
								{mr.receta.map((item, index) => {
										return (
											<ul key={index}>
												<li>Producto:</li>
												<li>{item.productName}</li>
												<hr/>
												<li>Droga:</li> 
												<li>{item.drugName}</li>
												<hr/>
												<li>Cantidad:</li>
												<li>{item.cantidad}</li>
												<hr/>
												<li>Presentación: </li>
												<li>{item.presentationName}</li>
												<hr/>
												<li>Indicaciones: </li>
												<li>{item.indicaciones}</li>
												{mr.receta.length >= 2 && <li>---------------------------------</li>}
												<hr/>
											</ul>
										);
									})
								}
							</ul>
						</div>
							<div className='orderToPrint__bottomContainer--barcode w-100'>
								<p>
									Número de receta
								</p>
								<div className='recipe-number'>
									<canvas
										className='w-50'
										id='barcodeRecipe'
										style={{
											display: 'block',
										}}
									/>
								</div>
							</div>
							{/*</div>*/}
							{/*{patient.n_afiliado ? (
								<div className='orderToPrint__bottomContainer--barcode'>
									<h4>
										<b>Número de afiliado</b>
									</h4>
									<div className='w-100'>
										<canvas
											className='w-100'
											id='barcodeAffiliate'
											style={{
												display: 'block',
											}}
										/>
									</div>
								</div>
							) : (
									<canvas
										className='w-100'
										id='barcodeAffiliate'
										style={{
											display: 'none',
										}}
									/>
								)}*/}
						
					</div>
					<div className='d-flex justify-content-around' id="pedirPorRappi">
						<a href="gbrappi://com.grability.rappi?store_type=market&market_type=farma_city" className="btn btn-blue-lg secondary">
							Comprá por Rappi
						</a>
					</div>
					<ReactToPrint
						trigger={() => (
							<div className='d-flex justify-content-around '>
								<div className='patient-action mt-4'><b style={{color: '#0A6DD7', fontSize: '18px'}}>Descarga receta</b></div>
							</div>
						)}
						content={() => compRef.current}
					/>
					<div className='d-flex justify-content-around' id="pedirPorRappi">
						<a href="gbrappi://com.grability.rappi?store_type=market&market_type=farma_city" className="btn btn-blue-lg secondary">
							Pedir por Rappi
						</a>
					</div>
					<div className='d-none'>{fromUP ? <RecipePDFUP {...dataToPrint} /> : <RecipePDF {...dataToPrint} />}</div>
				</div>
			) : (
					<p className='text-center mt-5 mb-5'>No se adjuntó receta.</p>
				)}
		</>
	);
};

export default Recipe;
