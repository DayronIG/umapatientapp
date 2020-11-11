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
    VecCertificado: '',
    certImg: '',
    sillaRuedas: false,
    acompañante: true,
    acompañanteName: ''
}

const RegisterForm = () => {
    const [dataForm, setForm] = useState(fromInitialState)

    const uploadImg = (e) => {

    }

    const checkboxHandler = (e) => {

    }

    const selectHandler = (e) => {

    }
    const inputChange = (e) => {

    }

    const handlerSubmit = (e) => {

    }

    return (
        <div className="RegisterFormWrapper">
            <BackButton />
            <h2>Datos del usuario</h2>
            <hr />
            <h4>Completa el siguiente formulario con los datos de la persona a trasladar</h4>
            <form>
                <UploadImg
                    title='Suba una foto del frente de su DNI*'
                    id='dni'
                    cb={uploadImg}
                />
                <YesNoCheckbox
                    title='¿Posee alguna discapacidad?*'
                    id='discapaticy'
                    cb={checkboxHandler}
                />
                {dataForm.discapacity && (
                    <>
                        <SelectRegister
                            title='¿Qué diagnóstico de discapacidad tiene?'
                            id='diagnostico'
                            cb={selectHandler}
                            options={['obeso', 'total']}
                        />
                        <SelectRegister
                            title='¿Qué grado de discapacidad tiene?'
                            id='gradoDiscapacidad'
                            cb={selectHandler}
                            options={['obeso', 'total']}
                        />
                        <div className="dataCertificado">
                            <InputRegister
                                title='N° certificado'
                                id='NroCertificado'
                                cb={inputChange}
                            />
                            <InputRegister
                                title='Fecha de venc.'
                                id='VecCertificado'
                                cb={inputChange}
                            />
                        </div>
                        <UploadImg
                            title='Suba una foto del certificado de discapacidad'
                            id='certImg'
                            cb={uploadImg}
                        />
                        <YesNoCheckbox
                            title='¿Usa silla de ruedas?'
                            id='sillaRuedas'
                            cb={checkboxHandler}
                        />
                        <YesNoCheckbox
                            title='¿Viaja con un acompañante?'
                            id='acompañante'
                            cb={checkboxHandler}
                        />
                        {dataForm.acompañante && (
                            <InputRegister
                                title='Nombre del acompañante'
                                id='acompañanteName'
                                cb={inputChange}
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