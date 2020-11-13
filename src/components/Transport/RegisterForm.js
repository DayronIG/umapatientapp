import React, { useState } from 'react'
import BackButton from '../GeneralComponents/Backbutton';
import { YesNoCheckbox, UploadImg, SelectRegister, InputRegister, ContinueButton } from './RegisterFormComponents'
import '../../styles/transport/registerForm.scss';
import Cleave from 'cleave.js/react';

import { useHistory, useParams } from 'react-router-dom';
import {CustomUmaLoader} from './../global/Spinner/Loaders';
import { SendForm } from './SendFormRegister';
import { useSelector, useDispatch } from 'react-redux';


const fromInitialState = {
    dni: '',
    dniPreview: '',
    discapacity: false,
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
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.front);
        
    const history = useHistory();
    const { ws } = useParams();


function buildImages(fileValue, id) {
    let imagePreview = '';
    if (typeof fileValue === 'string') {
        imagePreview = fileValue;
    } else {
        imagePreview = URL.createObjectURL(fileValue);
    }
    switch (id) {
        case 'dni':
         setForm({...dataForm, dni: fileValue,  dniPreview: imagePreview})   
            break;
       case 'certImg':
         setForm({...dataForm, certImg: fileValue,  certImgPreview: imagePreview})   
             break;
        default:
            break;
    }

    
}


    const [dataForm, setForm] = useState(fromInitialState)
    

    const checkboxHandlerDiscapacity = (e) => {
        setForm({...dataForm, discapacity: e.target.value === 'true' ? true : false})
    }

    const checkboxHandlerSillaRuedas = (e) => {
        setForm({...dataForm, sillaRuedas: e.target.value === 'true' ? true : false})
    }
    
    const  checkboxHandlerAcompañante= (e) => {
        setForm({...dataForm, acompañante: e.target.value === 'true' ? true : false})
    }

    const selectHandlerTypeDiscapacity = (e) => {
        setForm({...dataForm, diagnostico: e.target.value})
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

    const handlerSubmit = async (e) => {
        e.preventDefault()
        dispatch({ type: 'LOADING', payload:true});

       await SendForm(dataForm, history, ws) 

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
                {dataForm.discapacity}
                {dataForm.discapacity ? (
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
                ):null}
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