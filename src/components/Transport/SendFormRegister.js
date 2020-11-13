import React from 'react';
import moment from 'moment-timezone';
import { fileToBlob } from '../Utils/fileToBlob';
import { putFileFB } from '../Utils/firebaseUtils';
import { transport_register } from '../../config/endpoints';
import { transport } from '../../config/endpoints';
import Axios from 'axios';
import swal from 'sweetalert';
import Alert from '../GeneralComponents/Alert/Alerts';
import { useSelector, useDispatch } from 'react-redux';

export async function SendForm( dataForm, history, ws) {

try {
    console.log(dataForm)
    validation(dataForm);
    let licenceBlob;
    const dniBlob = await fileToBlob(dataForm.dni);
    const getUserData = JSON.parse(localStorage.getItem('userData'));
    const url_dni = await putFileFB(dniBlob, `/${getUserData.dni}/dni_photo`);

    let data = {
        'ws': getUserData.ws,
        'dni': getUserData.dni,
        'dt': '',
        'discapacidad': dataForm.discapacity,
        'dni_foto': url_dni,
    };

    if(dataForm.discapacity){
        licenceBlob = await fileToBlob(dataForm.certImg);
        const url_credential  = await putFileFB(licenceBlob, `/${getUserData.dni}/licence_photo`);
       
        let dataDiscapacityTrue = {
        'n_certificado': dataForm.NroCertificado,
        'silla_ruedas': dataForm.sillaRuedas,
        'diagnostico': dataForm.diagnostico,
        'amparo': dataForm.acompañante,
        'acompanante': dataForm.acompañanteName,
        'credencial_foto': dataForm.getLicenceFile,
        'certificado_foto': url_credential,
        'certificado_discapacidad_vencimiento': dataForm.VencCertificado
    } 
    data = {...data, dataDiscapacityTrue}
    }
    

    


    const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } };
    await Axios.post(transport_register, data, config);
    await swal({
        title: "Formulario enviado",
        text: "En breve será redireccionado a la página de inicio",
        icon: "success",
        buttons: true,
        timer: 3000
                });
                history.push(`/${getUserData.ws}/transportUserActive`);
} catch (error) {
    console.error(error);
    swal('Error', 'Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...', 'warning');
    setTimeout(function () {
        history.push(`/${ws}/transportRegister`);
    }, 2000);
} 
}

const validation = (dataForm) =>{
    const t = moment().add(7, 'days');
    const today = t.valueOf();
    const t2 = moment().add(7, 'days');

    const date2 = dataForm.VencCertificado.replace(/\//g, '-');

    const date3 = dataForm.VencCertificado.replace(/\//g, '-');
    const disDate = moment(date3).valueOf();
    const date = new RegExp("^([0-2][0-9]||3[0-1])/(0[0-9]||1[0-2])/([0-9][0-9])?[0-9][0-9]$");

    if (dataForm.discapacity === true) {
        if (!date.test(dataForm.VencCertificado)) {
            swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
            return null;
        }
        if (today >= disDate) {
            swal('Aviso', 'La fecha de vencimiento del certificado es incorrecta', 'warning')
            return null;
        }
    }
}