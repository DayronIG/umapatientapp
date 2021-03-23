import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useHistory} from "react-router-dom"
import { FaChevronDown, FaChevronUp, FaTrashAlt } from 'react-icons/fa';
import swal from 'sweetalert';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import DeliverySelectDestiny from '../DeliverySelectDestiny';
import ZoneCoveredHisopado from "../DeliveryPurchase/Components/ZoneCoveredHisopado"

const HisopadoCartItem = ({patient, index}) => {
    const dispatch = useDispatch()
    const { dni } = useSelector(state => state.user);
    const { deliveryInfo, changeMarker, hisopadoUserAddress, hisopadoDependantAddresses, addressObservations } = useSelector(state => state.deliveryService);
    const { piso, depto, lat, lng, user_obs } = useSelector(state => state.deliveryService.selectHomeForm);
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService.dependantInfo);
    const [openUser, setOpenUser] = useState(patient.isOpen);
    const [openModal, setOpenModal] = useState(false);
    const [isAddressValid, setIsAddressValid] = useState(true)
    const history = useHistory()
    const [data, setData] = useState({
        title: patient.patient?.title || patient.patient?.user,
        fullname: patient.patient?.user ,
        dni: patient.patient?.dni,
        ws: patient.patient?.ws,
        dob: patient.patient?.dob,
        sex: patient.patient?.sex,
        uid: patient.patient?.uid,
        obs: patient.destination?.user_obs || user_obs,
        address: patient.destination?.user_address || hisopadoUserAddress,
        piso: patient.destination?.user_floor || piso,
        depto: patient.destination?.user_number  || depto,
        lat: patient.destination?.user_lat || lat,
        lng: patient.destination?.user_lon || lng
    });
    const [fullnameError, setFullnameError] = useState(false);
    const [dniError, setDniError] = useState(false);
    const [wsError, setWsError] = useState(false);
    const [dobError, setDobError] = useState(false);
    const [sexError, setSexError] = useState(false);

    useEffect(() => {
        if(hisopadoDependantAddresses[index]){
            setData({...data, address: hisopadoDependantAddresses[index].address, lat: hisopadoDependantAddresses[index].lat, lon: hisopadoDependantAddresses[index].lon, user_obs: hisopadoDependantAddresses[index].user_obs})
        }
    }, [changeMarker])

    useEffect(() => {
        setIsAddressValid(isAddressValidForHisopado)
    }, [isAddressValidForHisopado, changeMarker])

    const handleConfirm = () => {
        if(!!data.sex && !!data.dob && !!data.dni && !!data.ws && !!data.fullname && !!data.address && !!data.lat && !!data.lng && isAddressValid) {
            setOpenUser(false);
            let sendData = {
                dni,
                service: 'HISOPADO',
                dependant: true,
                patient: {
                    sex: data.sex,
                    dob: data.dob,
                    dni: data.dni,
                    ws: data.ws,
                    user: data.fullname,
                    uid: data.uid
                },
                destination: {
                    user_address: data.address,
                    user_floor: data.piso,
                    user_number: data.depto,
                    user_lat: data.lat,
                    user_lon: data.lng, 
                    user_obs: data.obs
                },
                status: "FREE"
            }
            var deliveryInfoToReplace = deliveryInfo 
            deliveryInfoToReplace[index] = sendData
            localStorage.setItem("multiple_clients", JSON.stringify(deliveryInfoToReplace.filter(el=>el.status)))
            dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: deliveryInfoToReplace})
            dispatch({type: "CHANGE_MARKER"})
            console.log(sendData)
            // let headers = { 'Content-Type': 'Application/Json' }
            // axios.post(create_delivery, sendData, headers)
            //     .then(res => console.log(res))
            //     .catch(err => console.log(err))
        } else {
            if(!!!data.fullname) {
                setFullnameError(true);
            }
            if(!!!data.dni) {
                setDniError(true);
            }
            if(!!!data.ws) {
                setWsError(true);
            }
            if(!!!data.dob) {
                setDobError(true);
            }
            if(!!!data.sex) {
                setSexError(true);
            }
            if(!isAddressValid){
                swal("Domicilio inválido", "Debe colocar un domicilio ubicado en el rango de operación","warning")
            }
            if(!!data.fullname && !!data.dni && !!data.ws && !!data.dob && !!data.sex && !!!data.address) {
                swal("Faltan completar datos", "Debe completar el domicilio para continuar", "warning")
            }
            return false;
        }
    }

    const removeItem = useCallback(() => {
        deliveryInfo.splice(index,1)
        let newDeliveryInfo = [...deliveryInfo]
        localStorage.setItem("multiple_clients", JSON.stringify(newDeliveryInfo))
        dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: newDeliveryInfo})
    }, [deliveryInfo])

    return (
        <article className="HisopadoCart__user">
            <div className="HisopadoCart__userTitle" onClick={() => {
                setOpenUser(!openUser);
            }}>
                <p className="HisopadoCart__userName">{data.user || data.title}</p>
                {
                !openUser ?
                <FaChevronDown /> :
                <FaChevronUp />
                }
            </div>
            <div className={`HisopadoCart__userData ${openUser ? 'open' : ''}`}>
                <div className={`${fullnameError ? 'error' : ''}`}>
                    <label>Nombre y Apellido</label>
                    <input 
                        type="text"
                        inputMode="text" 
                        value={data.fullname || ''} 
                        onChange={(e) => {
                            setFullnameError(false);
                            setData({...data, title: e.target.value, fullname: e.target.value});
                        }}
                        required
                    />
                </div>

                <div className={`${dniError ? 'error' : ''}`}>
                    <label>Identificación, cédula o DNI</label>
                    <input 
                        type="text"
                        required
                        inputMode="numeric"
                        value={data.dni || ''} 
                        onChange={(e) => {
                            setDniError(false);
                            setData({...data, dni: e.target.value});
                        }}
                    />
                </div>
                
                <div className={`${wsError ? 'error' : ''}`}>
                    <label>N° de celular</label>
                    <input 
                        type="text"
                        required
                        inputMode="tel"
                        value={data.ws || ''} 
                        onChange={(e) => {
                            setWsError(false)
                            setData({...data, ws: e.target.value});
                        }}
                    />
                </div> 

                <div className="columns">
                    <div className={`${dobError ? 'error' : ''}`}>
                        <label>Fecha de nacimiento</label>
                        <input 
                            type="date"
                            required     
                            value={data.dob || ''} 
                            onChange={(e) => {
                                setDobError(false);
                                setData({...data, dob: e.target.value});
                            }}
                        />
                    </div>
                    <div className={`${sexError ? 'error' : ''}`}>
                        <label>Sexo</label>
                        <select
                            value={data.sex || 'none'} 
                            name="sexo"
                            onChange={(e) => {
                                setSexError(false);
                                setData({...data, sex: e.target.value});
                            }}
                        >
                            <option value="none" defaultValue disabled>- Seleccionar -</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                </div>
                <div onClick={() => setOpenModal(true)} className={`${isAddressValid ? '' : 'error'}`}>
                    <label>Domicilio</label>
                    <input 
                        type="text" 
                        value={data.address || ''} 
                        onChange={(e) => {
                            setData({...data, address: e.target.value});
                        }}
                        readOnly
                    />
                </div> 

                <div className="columns">
                    <div>
                        <label>Piso</label>
                        <input 
                            type="text" 
                            value={data.piso || ''} 
                            onChange={(e) => {
                                setData({...data, piso: e.target.value});
                            }}
                        /> 
                    </div>
                    <div>
                        <label>Departamento</label>
                        <input 
                            type="text" 
                            value={data.depto || ''} 
                            onChange={(e) => {
                                setData({...data, depto: e.target.value});
                            }}
                        /> 
                    </div>
                </div>
                <div>
                    <label>Observaciones</label>
                    <input 
                        type="text"
                        inputMode="text"
                        placeholder="Aclaración para el personal" 
                        value={data.obs || ''}
                        onChange={(e) => {
                            setData({...data, obs: e.target.value});
                        }}
                    />
                </div>
                <>
                    <button className="HisopadoCart__btnAddress" onClick={() => setOpenModal(true)}>Cambiar domicilio</button>
                    <button className="HisopadoCart__btnConfirm" onClick={handleConfirm}>Guardar</button>
                </> 
                <button className="HisopadoCart__btnDelete" onClick={removeItem}><FaTrashAlt /></button>
            </div>
            <div className="HisopadoCart__modal">
            {
                openModal &&
                <MobileModal hideTitle callback={()=>setOpenModal(false)} surveyHisopados noScroll>
                    {
                    isAddressValid? 
                    <DeliverySelectDestiny 
                    dependantIndex={index}
                    finalAction={()=> setOpenModal(false)}
                    isModal />
                    :<ZoneCoveredHisopado 
                    isModal={true} 
                    goPrevious={()=>{
                        setIsAddressValid(true)
                        }} 
                    history={history} />
                    }
                </MobileModal>
            }
            </div>
        </article>
    )
}

export default HisopadoCartItem;