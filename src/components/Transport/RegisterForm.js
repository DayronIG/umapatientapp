import React, { useState } from 'react'
import BackButton from '../GeneralComponents/Backbutton'
import { YesNoCheckbox, UploadImg, SelectRegister, InputRegister, ContinueButton } from './RegisterFormComponents'
import '../../styles/transport/registerForm.scss'

const fromInitialState = {
    dniImg: '',
    discapacity: true,
    diagnostico: '',
    gradoDiscapacidad: '',
    NroCertificado: '',
    VencCertificado: '',
    certImg: '',
    sillaRuedas: false,
    acompañante: true,
    acompañanteName: ''
}

const RegisterForm = () => {
    const [dataForm, setForm] = useState(fromInitialState)

    const uploadImgDni = (e) => {
        setForm({...dataForm, certImg: e.target.value})
    }

    const uploadImgFotoCertificado = (e) => {
        setForm({...dataForm, dniImg: e.target.value})
    }
    

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
        setForm({...dataForm, dniImg: e.target.value})
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
        setForm({...dataForm, dniImg: e.target.value})
    }

    const handlerSubmit = (e) => {
        setForm({...dataForm, acompañanteName: e.target.value})
    }

    return (
        <div className="RegisterFormWrapper">
            <BackButton />
            <h2 className="RegisterFormWrapper_title">Datos del usuario</h2>
            <hr />
            <h4 className="RegisterFormWrapper_subtitle">Completa el siguiente formulario con los datos de la persona a trasladar</h4>
            <form className="RegisterFormWrapper_form">

                <UploadImg
                    title='Suba una foto del frente de su DNI*'
                    id='dni'
                    cb={uploadImgDni}
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
                            options={['obeso', 'total']}
                        />
                        <SelectRegister
                            title='¿Qué grado de discapacidad tiene?'
                            id='gradoDiscapacidad'
                            cb={selectHandlerGradoDiscapacidad}
                            options={['obeso', 'total']}
                        />
                        <div className="dataCertificado">
                            <InputRegister
                                title='N° certificado'
                                id='NroCertificado'
                                cb={inputChangeDataCertificado}
                            />
                            <InputRegister
                                title='Fecha de venc.'
                                id='VecCertificado'
                                cb={inputChangeVencCertificado}
                            />
                        </div>
                        <UploadImg
                            title='Suba una foto del certificado de discapacidad'
                            id='certImg'
                            cb={uploadImgFotoCertificado}
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
    )
}

export default RegisterForm