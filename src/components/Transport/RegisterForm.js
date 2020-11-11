import React, { useState } from 'react'
import BackButton from '../GeneralComponents/Backbutton'
const RegisterForm = () => {
    const [dataForm, setForm] = useState({ dniImg: '', discapacity: true, acompañante: true })
    return (
        <div className="RegisterFormWrapper">
            <BackButton />
            <h2>Datos del usuario</h2>
            <hr />
            <h4>Completa el siguiente formulario con los datos de la persona a trasladar</h4>
            <form>
                <label htmlFor="uploadImgDNI">
                    Suba una foto del frente de su DNI
                </label>
                <input type="file" />
                <label htmlFor="">
                    ¿Posee alguna discapacidad?
                </label>
                <label htmlFor="DiscapacityYes">Si</label>
                <input type="checkbox" id='DiscapacityYes' />
                <label htmlFor="DiscapacityNo">No</label>
                <input type="checkbox" id='DiscapacityNo' />
                {dataForm.discapacity && (
                    <>
                        <label htmlFor="diagnosticoDisca">
                            ¿Qué diagnóstico de discapacidad es?
                        </label>
                        <select name="" id="diagnosticoDisca">
                            <option value="1">No sabe nada</option>
                            <option value="2">Ayudaaa</option>
                        </select>
                        <label htmlFor="gradoDisca">
                            ¿Qué grado de discapacidad es?
                        </label>
                        <select name="" id="gradoDisca">
                            <option value="1">No sabe nada</option>
                            <option value="2">Ayudaaa</option>
                        </select>
                        <div className="dataCertificado">
                            <div className="nroCertificado">
                                <label htmlFor="nroCertificado">N° certificado</label>
                                <input type="number" id='nroCertificado' />
                            </div>
                            <div className="vencimientoCert">
                                <label htmlFor="vencimiento">Fecha de venc.</label>
                                <input type="number" id='vencimiento' />
                            </div>
                        </div>
                        <label htmlFor="uploadImgCERT">
                            Suba una foto del certificado de discapacidad
                        </label>
                        <input type="file" />
                        <label htmlFor="">
                            ¿Usa silla de ruedas?
                        </label>
                        <label htmlFor="sillaRuedasYes">Si</label>
                        <input type="checkbox" id='sillaRuedasYes' />
                        <label htmlFor="sillaRuedasNo">No</label>
                        <input type="checkbox" id='sillaRuedasNo' />
                        <label htmlFor="">
                            ¿Viaja con un acompañante?
                        </label>
                        <label htmlFor="acompañanteYes">Si</label>
                        <input type="checkbox" id='acompañanteYes' />
                        <label htmlFor="acompañanteNo">No</label>
                        <input type="checkbox" id='acompañanteNo' />
                        {dataForm.acompañante && (
                            <>
                                <label htmlFor="nroCertificado">Nombre del acompañante</label>
                                <input type="number" id='nroCertificado' />
                            </>
                        )}
                    </>
                )}


            </form>
        </div>
    )
}

export default RegisterForm