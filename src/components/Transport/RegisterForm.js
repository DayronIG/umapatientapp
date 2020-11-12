import React, { useState } from 'react'
import BackButton from '../GeneralComponents/Backbutton';

import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';
import swal from 'sweetalert';
import { transport_register } from '../../config/endpoints';
import { transport } from '../../config/endpoints';
import Alert from '../GeneralComponents/Alert/Alerts';
import { fileToBlob } from '../Utils/fileToBlob';
import { putFileFB } from '../Utils/firebaseUtils';
import { YesNoCheckbox, UploadImg, SelectRegister, InputRegister, ContinueButton } from './RegisterFormComponents'
import '../../styles/transport/registerForm.scss';
import Cleave from 'cleave.js/react';
import {CustomUmaLoader} from './../global/Spinner/Loaders';
import moment from 'moment-timezone';



const fromInitialState = {
    dni: '',
    dniPreview: '',
    discapacity: true,
    diagnostico: '',
    gradoDiscapacidad: '',
    NroCertificado: '',
    VencCertificado: '',
    certImg: '',
    certImgPreview: '',
    sillaRuedas: false,
    acompañante: false,
    acompañanteName: '',
}



const RegisterForm = () => {

const [loading, setLoading] = useState(false)
    const history = useHistory();
    const { ws } = useParams();


async function sendForm() {
    setLoading(true)
    const t = moment().add(7, 'days');
    const today = t.valueOf();
    const t2 = moment().add(7, 'days');

    const date2 = dataForm.VencCertificado.replace(/\//g, '-');

    const date3 = dataForm.VencCertificado.replace(/\//g, '-');
    const disDate = moment(date3).valueOf();
try {
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
  
    const licenceBlob = await fileToBlob(dataForm.certImg);
    const dniBlob = await fileToBlob(dataForm.dni);
    const getUserData = JSON.parse(localStorage.getItem('userData'));
    const [url_credential, url_dni] = await Promise.all([
        putFileFB(dniBlob, `/${getUserData.dni}/dni_photo`),
        putFileFB(licenceBlob, `/${getUserData.dni}/licence_photo`)
    ]);
    const data = {
        'ws': getUserData.ws,
        'dni': getUserData.dni,
        'dt': '',
        'discapacidad': dataForm.discapacity,
        'credencial': dataForm.NroCertificado,
        'silla_ruedas': dataForm.sillaRuedas,
        'diagnostico': dataForm.diagnostico,
        'amparo': dataForm.acompañante,
        'acompanante': dataForm.acompañanteName,
        'dni_foto': url_dni,
        'credencial_foto': dataForm.getLicenceFile,
        'certificado_foto': url_credential,
        'certificado_discapacidad_vencimiento': dataForm.VencCertificado
    };
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
} finally {
    setLoading(false)

}
}


function buildImages(fileValue, id) {
    let imagePreview = '';
    if (typeof fileValue === 'string') {
        imagePreview = fileValue;
    } else {
        imagePreview = URL.createObjectURL(fileValue);
    }

    
    switch (id) {
        case 'dni':
         setForm({...dataForm, id: fileValue,  dniPreview: imagePreview})   
            break;
       case 'certImg':
         setForm({...dataForm, id: fileValue,  certImgPreview: imagePreview})   
             break;
        default:
            break;
    }

    
}


    const [dataForm, setForm] = useState(fromInitialState)

    const checkboxHandlerDiscapacity = (e) => {
        setForm({...dataForm, diagnostico: e.target.value})
    }

    const checkboxHandlerSillaRuedas = (e) => {
        setForm({...dataForm, sillaRuedas: e.target.value})
    }
    
    const  checkboxHandlerAcompañante= (e) => {
        setForm({...dataForm, acompañante: e.target.value})
    }

    const selectHandlerTypeDiscapacity = (e) => {
        setForm({...dataForm, dni: e.target.value})
    }

    const selectHandlerGradoDiscapacidad = (e) => {
        setForm({...dataForm, gradoDiscapacidad: e.target.value})
    }

    const inputChangeDataCertificado = (e) => {
        setForm({...dataForm, NroCertificado: e.target.value})
    }

    const inputChangeVencCertificado = (e) => {
        setForm({...dataForm, VencCertificado: e.target.value})
    }

    const inputChangeNameAcompañante = (e) => {
        setForm({...dataForm, acompañanteName: e.target.value})
    }

    const handlerSubmit = (e) => {
        sendForm();
    }

    if(!loading){
        return <div className="RegisterFormWrapper">
            <BackButton />
            <h2 className="RegisterFormWrapper_title">Datos del usuario</h2>
            <hr />
            <h4 className="RegisterFormWrapper_subtitle">Completa el siguiente formulario con los datos de la persona a trasladar</h4>
            <form className="RegisterFormWrapper_form">

                <UploadImg
                previewImage={dataForm.dniPreview}
                    title='Suba una foto del frente de su DNI*'
                    id='dni'
                    cb={buildImages}
                />
                <YesNoCheckbox
                    title='¿Posee alguna discapacidad?*'
                    id='discapacity'
                    cb={checkboxHandlerDiscapacity}
                />
                {dataForm.discapacity && (
                    <>
                        <SelectRegister
                            title='¿Qué diagnóstico de discapacidad tiene?'
                            id='diagnostico'
                            cb={selectHandlerTypeDiscapacity}
                            options={['DISCAPACIDAD FISICA', 'DISCAPACIDAD SENSORIAL', 'DISCAPACIDAD PSIQUICA', 'DISCAPACIDAD VISCERAL', 'DISCAPACIDAD MULTIPLE']}
                        />
                        <SelectRegister
                            title='¿Qué grado de discapacidad tiene?'
                            id='gradoDiscapacidad'
                            cb={selectHandlerGradoDiscapacidad}
                            options={['NINGUNA', 'ESCASA', 'MODERADA', 'GRAVE', 'TOTAL']}
                        />
                        <div className="dataCertificado">
                            <InputRegister
                                title='N° certificado'
                                id='NroCertificado'
                                cb={inputChangeDataCertificado}
                            />
                            <div className="InputDate">
                                <label>
                                    Fecha de Venc.
                                </label>
                                  <Cleave
                        placeholder="dd/mm/aaaa"
                        options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                        onChange={inputChangeVencCertificado}
                        value={dataForm.VencCertificado}
                        className="cleave"
                                />
                            </div>
                          
                                {/* <InputRegister
                                    title='Fecha de venc.'
                                    id='VecCertificado'
                                    cb={inputChangeVencCertificado}
                                /> */}
                        </div>
                        <UploadImg
                        previewImage={dataForm.certImgPreview}
                            title='Suba una foto del certificado de discapacidad'
                            id='certImg'
                            cb={buildImages}
                        />
                        <YesNoCheckbox
                            title='¿Usa silla de ruedas?'
                            id='sillaRuedas'
                            cb={checkboxHandlerSillaRuedas}
                        />
                        <YesNoCheckbox
                            title='¿Viaja con un acompañante?'
                            id='acompañante'
                            cb={checkboxHandlerAcompañante}
                        />
                        {dataForm.acompañante && (
                            <InputRegister
                                title='Nombre del acompañante'
                                id='acompañanteName'
                                cb={inputChangeNameAcompañante}
                            />
                        )}
                    </>
                )}
                <ContinueButton
                    title='Finalizar'
                    type='submit'
                    cb={handlerSubmit}
                />
            </form>
        </div>
}else{
    return <CustomUmaLoader />
}
}

export default RegisterForm