import moment from 'moment-timezone';
import { fileToBlob } from '../Utils/fileToBlob';
import { putFileFB } from '../Utils/firebaseUtils';
import { transport_register } from '../../config/endpoints';
import Axios from 'axios';
import swal from 'sweetalert';

export async function sendForm(dataForm, user) {
	try {
		const isValid = validation(dataForm);
		if(!isValid) throw new Error('No pasó la validación de fechas.');
		let licenceBlob;
		const dniBlob = await fileToBlob(dataForm.dni);
		const url_dni = await putFileFB(dniBlob, `/${user.dni}/dni_photo`);
		let data = {
				'ws': user.ws,
				'dni': user.dni,
				'dt': '',
				'discapacidad': dataForm.discapacity,
				'dni_foto': url_dni,
		};
		if(dataForm.discapacity) {
			licenceBlob = await fileToBlob(dataForm.certImg);
			const url_credential  = await putFileFB(licenceBlob, `/${user.dni}/licence_photo`);
			const dataDiscapacityTrue = {
				'n_certificado': dataForm.NroCertificado,
				'silla_ruedas': dataForm.sillaRuedas,
				'diagnostico': dataForm.diagnostico,
				'amparo': dataForm.acompañante,
				'acompanante': dataForm.acompañanteName,
				'credencial_foto': dataForm.getLicenceFile,
				'certificado_foto': url_credential,
				'certificado_discapacidad_vencimiento': dataForm.VencCertificado
			};
			data = { ...data, ...dataDiscapacityTrue };
		}
		const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } };
		await Axios.post(transport_register, data, config);
		return true;
	} catch (error) {
		console.error(error);
		throw error;
	} 
}

const validation = (dataForm) =>{
		console.log(dataForm);
    const t = moment().add(7, 'days');
    const today = t.valueOf();
    const date3 = dataForm.VencCertificado.replace(/\//g, '-');
    const disDate = moment(date3).valueOf();
    const date = new RegExp("^([0-2][0-9]||3[0-1])/(0[0-9]||1[0-2])/([0-9][0-9])?[0-9][0-9]$");
    if (dataForm.discapacity === true) {
			if (!date.test(dataForm.VencCertificado)) {
					swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
					return false;
			}
			if (today >= disDate) {
					swal('Aviso', 'La fecha de vencimiento del certificado es incorrecta', 'warning')
					return false;
			}
		}
		return true;
}