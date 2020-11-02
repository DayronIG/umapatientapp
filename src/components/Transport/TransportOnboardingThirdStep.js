
import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { GenericHeader } from '../GeneralComponents/Headers';
import { transport } from '../../config/endpoints';
import Alert  from  '../GeneralComponents/Alert/Alerts';
import Cleave from 'cleave.js/react';
import '../../styles/generalcomponents/TransportOnboardingThirdStep.scss';
import Loader from '../GeneralComponents/Loading';

const TransportOnboarding = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.userActive.token)
    const user = useSelector(state => state.onboardingSecondStep)
    /* Second Form data */
    const getDisability = useSelector((state) => state.onboardingSecondStep.disability);
    const getCertificate = useSelector((state) => state.onboardingSecondStep.certificateNumber);
    const getWheelChair = useSelector((state) => state.onboardingSecondStep.wheelChair);
    const getDiagnostic = useSelector((state) => state.onboardingSecondStep.diagnostic);
    const getProtection = useSelector((state) => state.onboardingSecondStep.protection);
    const getCompanionName = useSelector((state) => state.onboardingSecondStep.companionName);
    /* Third Form data */
    const getIdPreview = useSelector((state) => state.onboardingThirdStep.id.filePreview);
    const getLicencePreview = useSelector((state) => state.onboardingThirdStep.licence.filePreview);
    const getQualificationPreview = useSelector((state) => state.onboardingThirdStep.qualification.filePreview);
    const getIdFile = useSelector((state) => state.onboardingThirdStep.id.file);
    const getLicenceFile = useSelector((state) => state.onboardingThirdStep.licence.file);
    const getQualificationFile = useSelector((state) => state.onboardingThirdStep.qualification.file);
    const getIdExpires = useSelector((state) => state.onboardingThirdStep.idExpires);
    const getCredentialExpires = useSelector((state) => state.onboardingThirdStep.credentialExpires);
    const getDisabilityExpires = useSelector((state) => state.onboardingThirdStep.disabilityExpires);
    const getLoader = useSelector((state) => state.front.loading)
    /* Local States */
    const [displayAlert, setDisplayAlert] = useState(false);
    const [getLoading, setLoading] = useState(false);
    const getUserData = JSON.parse(localStorage.getItem('userData'))
    function goBack() {
        dispatch({type: 'SET_PAGINATION_TRANSPORT', payload: 1})
    }
    
    function sendForm() {
        
        
        const date = new RegExp("^([0-2][0-9]||3[0-1])/(0[0-9]||1[0-2])/([0-9][0-9])?[0-9][0-9]$");
        if (!date.test(getIdExpires) || !date.test(getCredentialExpires)){
            swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
            return};
            
        if (user.disability != "0-NINGUNA"){
            if (!date.test(getDisabilityExpires)){
                swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
                return}
        }
        
        const getUserData = JSON.parse(localStorage.getItem('userData'))
        setLoading(true)
        dispatch({type: 'LOADING', payload: true})
        Axios.post(transport, {
            'ws': getUserData.ws,
            'dni': getUserData.dni,
            'dt': '',
            'discapacidad' : getDisability,
            'credencial' : getCertificate,
            'silla_ruedas' : getWheelChair,
            'diagnostico' : getDiagnostic,
            'amparo' : getProtection,
            'acompanante' : getCompanionName,
            'dni_foto': getIdFile,
            'credencial_foto': getLicenceFile,
            'certificado_foto': getQualificationFile,
            'dni_vencimiento': getIdExpires,
            'credencial_vencimiento': getCredentialExpires,
            'certificado_discapacidad_vencimiento': getDisabilityExpires
        }, { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } })
        .then(function (response) {
            backToMainMenu();
            setLoading(false);
            setDisplayAlert(true);
        })
        .catch(function (error) {
            setLoading(false);
            alert('Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...')
            setTimeout(function() {
                props.history.push(`/TransportRegister`) 
                goBack()
            }, 4000)
            
            console.log(error);
        })
        
    }

    function backToMainMenu() {
        setTimeout(function() {
            props.history.push(`/${getUserData.ws}/transportUserActive`) 
        }, 4000)
        setTimeout(function(){
            dispatch({type: 'LOADING', payload: false})
        }, 2000)
    }

    function buildImages(typeAction, fileValue) {
        var imagePreview = '';
        if (typeof fileValue === 'string') {
            imagePreview = fileValue;
        } else {
            imagePreview = URL.createObjectURL(fileValue);
        }
        dispatch({ type: typeAction, payload: { filePreview: imagePreview, file: fileValue } })
    }

    return (
        <>
         {getLoader && <Loader />}
            <GenericHeader>Registro</GenericHeader>
            { displayAlert &&
                <Alert 
                    alertType="success" 
                    timerRemove='4000' 
                    titleMessage='Formulario enviado' 
                    customMessage='En breve será redireccionado a la página de inicio'/> 
            }
            <div className="TransportOnboardingThirdStep">
                <div className="uploadDocumentationWrapper">
                    <div className="d-flex justify-content-center">
                        <div className="columnUpload">
                            <div className="uploadMandatoryWrapper d-flex justify-content-center">
                                <div className="title">DNI</div>
                                { getIdPreview ? '': <span className="mandatoryField">&nbsp;*</span> }
                            </div>
                            <label htmlFor="upload-photo-dni" className="btn btn-active inputfile">
                                <div className="imgPreview">
                                    { getIdPreview ? 
                                        <img src={ getIdPreview } alt="DNI"/> 
                                        : <FontAwesomeIcon className="folder" icon={faFolderOpen}/> 
                                    }
                                </div>
                                <FontAwesomeIcon className="addDoc" icon={faPlusCircle}/>
                            </label>
                            <input type="file" 
                                name="Cargar DNI" 
                                id="upload-photo-dni" 
                                onChange={(e) => buildImages('ADD_ID_THIRD_STEP', e.target.files[0])}/>
                        </div>
                        <div className="columnUpload">
                            <div className="uploadMandatoryWrapper d-flex justify-content-center">
                                <div className="title">Credencial</div>
                                { getLicencePreview ? '': <span className="mandatoryField">&nbsp;*</span> }
                            </div>
                            <label htmlFor="upload-photo-licence" className="btn btn-active inputfile">
                                <div className="imgPreview">
                                    { getLicencePreview ? 
                                        <img src={ getLicencePreview } alt="Credencial"/> 
                                        : <FontAwesomeIcon className="folder" icon={faFolderOpen}/> 
                                    }
                                </div>
                                <FontAwesomeIcon className="addDoc" icon={faPlusCircle}/>
                            </label>
                            <input type="file" 
                                name="Cargar Credencial" 
                                id="upload-photo-licence" 
                                onChange={(e) => buildImages('ADD_LICENCE_THIRD_STEP', e.target.files[0])}/>
                        </div>
                        { getDisability !== "0-NINGUNA" ? 
                            <div className="columnUpload">
                                <div className="title">Certificado</div>
                                <label htmlFor="upload-photo-disability" className="btn btn-active inputfile">
                                    <div className="imgPreview">
                                        { getQualificationPreview ? 
                                            <img src={ getQualificationPreview } alt="Certificado"/> 
                                            : <FontAwesomeIcon className="folder" icon={faFolderOpen}/> 
                                        }
                                    </div>

                                    <FontAwesomeIcon className="addDoc" icon={faPlusCircle}/>
                                </label>
                                <input type="file" 
                                    name="Cargar Discapacidad" 
                                    id="upload-photo-disability" 
                                    onChange={(e) => buildImages('ADD_QUALIFICATION_THIRD_STEP', e.target.files[0])}/>
                            </div>
                        : ''}
                    </div>
                </div>
                <div className="dateDocumentExpiresWrapper">
                    <div className="titleThirdStep">Vencimiento de DNI</div>
                    { getIdExpires ? '': <span className="mandatoryField">* Obligatorio</span> }
                    {/* <input type="text" 
                    options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                        placeholder={'dd/mm/aaaa'}
                        value={getIdExpires} 
                        className="form-control expireDate"
                        onChange={(e) => dispatch({type: 'ADD_ID_EXPIRATION_THIRD_STEP', payload: e.target.value})}/> */}
                         <Cleave
                         
							placeholder="dd/mm/aaaa"
                            options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                            onChange={(e) => dispatch({type: 'ADD_ID_EXPIRATION_THIRD_STEP', payload: e.target.value})}
                            value={getIdExpires} 
                            className="form-control expireDate"
                        /> 
                    <div className="titleThirdStep">Vencimiento de Credencial</div>
                    { getCredentialExpires ? '': <span className="mandatoryField">* Obligatorio</span> }
                    {/* <input type="text" 
                        placeholder={'dd/mm/aaaa'}
                        value={getCredentialExpires} 
                        className="form-control expireDate"
                        onChange={(e) => dispatch({type: 'ADD_CREDENTIAL_EXPIRATION_THIRD_STEP', payload: e.target.value})}/> */}
                     <Cleave
							placeholder="dd/mm/aaaa"
                            options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                            onChange={(e) => dispatch({type: 'ADD_CREDENTIAL_EXPIRATION_THIRD_STEP', payload: e.target.value})}
                            value={getCredentialExpires} 
                            className="form-control expireDate"
                        /> 
                    { getDisability !== "0-NINGUNA" ? 
                        <div>
                            <div className="titleThirdStep">Vencimiento de Certificado de discapacidad</div>
                            {/* <input type="text" 
                                placeholder={'dd/mm/aaaa'}
                                value={getDisabilityExpires} 
                                className="form-control expireDate"
                                onChange={(e) => dispatch({type: 'ADD_DISABILITY_EXPIRATION_THIRD_STEP', payload: e.target.value})}/> */}
                            <Cleave
							placeholder="dd/mm/aaaa"
                            options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                            onChange={(e) => dispatch({type: 'ADD_DISABILITY_EXPIRATION_THIRD_STEP', payload: e.target.value})}
                            value={getDisabilityExpires} 
                            className="form-control expireDate"
                        /> 
                        </div>
                        
                    : ''}
                </div>
                <div className="buttonsContainer">
                    <div className="buttonContainer">
                        <button  
                            
                            disabled={!getIdPreview || !getLicencePreview || !getIdExpires || !getCredentialExpires} 
                            className="btn btn-active" 
                            onClick={() => sendForm()}>      
                                { getLoading ? 
                                    <div className="wrapperLoading">
                                        <div className="loading spinner-border text-primary" role="initial">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )      
}

export default withRouter(TransportOnboarding);
