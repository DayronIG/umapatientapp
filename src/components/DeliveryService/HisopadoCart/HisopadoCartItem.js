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
    const { deliveryInfo, changeMarker, hisopadoUserAddress } = useSelector(state => state.deliveryService);
    const { address, piso, depto, lat, lng } = useSelector(state => state.deliveryService.selectHomeForm);
    const dependantInfo = useSelector(state => state.deliveryService.dependantInfo);
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService.dependantInfo);
    const [openUser, setOpenUser] = useState(patient.isOpen);
    const [openModal, setOpenModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true)
    const history = useHistory()
    const [data, setData] = useState({
        title: patient.patient?.title || patient.patient?.user,
        fullname: patient.patient?.user ,
        dni: patient.patient?.dni,
        ws: patient.patient?.ws,
        dob: patient.patient?.dob,
        sex: patient.patient?.sex,
        obs: '',
        address: patient.destination?.user_address || hisopadoUserAddress || address,
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


    // const [deliveryInfoToMap, setDeliveryInfoToMap] = useState([]) 

    // useEffect(()=>{
    //     deliveryInfo.map(patient => {
    //         setDeliveryInfoToMap([...deliveryInfoToMap, {
    //             title: patient.patient?.title || patient.patient?.user || patient.dependantData?.user,
    //             fullname: patient.patient?.user || patient.dependantData?.user,
    //             dni: patient.patient?.dni|| patient.dependantData?.dni,
    //             ws: patient.patient?.ws|| patient.dependantData?.ws,
    //             dob: patient.patient?.dob|| patient.dependantData?.dob,
    //             sex: patient.patient?.sex|| patient.dependantData?.sex,
    //             obs: '',
    //             address: patient.destination?.user_address || patient.dependantDestination?.user_address || hisopadoUserAddress || address,
    //             piso: patient.destination?.user_floor || patient.dependantDestination?.user_address || piso,
    //             depto: patient.destination?.user_number || patient.dependantDestination?.user_number || depto,
    //             lat: patient.destination?.user_lat || patient.dependantDestination?.user_lat || lat,
    //             lng: patient.destination?.user_lon || patient.dependantDestination?.user_lon || lng
    //         }])
    //     })
    // })


    useEffect(() => {
        console.log(patient, "---> RENDERING PATIENT")
        setIsAddressValid(isAddressValidForHisopado)
    }, [isAddressValidForHisopado, changeMarker])

    useEffect(() => {
        if(Object.entries(dependantInfo).length !== 1) {
            setData({...data,
            address: dependantInfo.address,
            piso: dependantInfo.piso,
            depto: dependantInfo.depto,
            lat: dependantInfo.lat,
            lng: dependantInfo.lng
            });
        }
    }, [dependantInfo])

    const handleConfirm = () => {
        if(!!data.sex && !!data.dob && !!data.dni && !!data.ws && !!data.fullname && !!data.address && !!data.lat && !!data.lng && isAddressValid) {
            setShowBtn(false);
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
                    user: data.fullname
                },
                destination: {
                    user_address: data.address,
                    user_floor: data.piso,
                    user_number: data.depto,
                    user_lat: data.lat,
                    user_lon: data.lng
                },
                status: "FREE"
            }
            var deliveryInfoToReplace = deliveryInfo 
            deliveryInfoToReplace[index] = sendData
            localStorage.setItem("multiple_clients", JSON.stringify(deliveryInfoToReplace.filter(el=>el.status)))
            dispatch({type: 'SET_DELIVERY_FROM_ZERO', payload: deliveryInfoToReplace})
            dispatch({type: "CHANGE_MARKER"})
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
                    <label>Nombre y apellido</label>
                    <input 
                        type="text"
                        required
                        inputMode="text" 
                        value={data.fullname || ''} 
                        onChange={(e) => {
                            setFullnameError(false);
                            setData({...data, title: e.target.value, fullname: e.target.value});
                        }}
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

                <div>
                    <label>Observaciones</label>
                    <input 
                        type="text"
                        inputMode="text"
                        placeholder="Aclaración para el personal médico" 
                        value={data.obs || ''}
                        onChange={(e) => {
                            setData({...data, obs: e.target.value});
                        }}
                    />
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
                            readOnly
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
                            readOnly
                        /> 
                    </div>
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