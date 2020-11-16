import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaChevronDown, FaChevronUp, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { create_delivery } from '../../../config/endpoints';
import axios from 'axios';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import DeliverySelectDestiny from '../DeliverySelectDestiny';

const HisopadoCartItem = ({patient, id}) => {
    const { dni } = useSelector(store => store.queries.patient);
    const { address, piso, depto, lat, lng } = useSelector(store => store.deliveryService.selectHomeForm);
    const dependantInfo = useSelector(store => store.deliveryService.dependantInfo);
    const [openUser, setOpenUser] = useState(patient.isOpen);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState({
        title: patient.title,
        fullname: patient.fullname,
        dni: patient.dni,
        ws: patient.ws,
        dob: patient.dob,
        sex: patient.sex,
        obs: '',
        address: patient.address || address,
        piso: patient.piso || piso,
        depto: patient.depto || depto,
        lat: null,
        lng: null
    });

    useEffect(() => {
        setData({...data,
          address: dependantInfo.address,
          piso: dependantInfo.piso,
          depto: dependantInfo.depto,
          lat: dependantInfo.lat,
          lng: dependantInfo.lng
        });

        setOpenModal(false);
    }, [dependantInfo])

    const handleConfirm = () => {
        if(!localStorage.getItem("hisopadosPatients")) {
            const arr_patients = [];
            arr_patients.push(data);
            localStorage.setItem('hisopadosPatients', JSON.stringify(arr_patients));
        } else {
            const arr_patients = JSON.parse(localStorage.getItem("hisopadosPatients"))
            arr_patients.push(data);
            localStorage.setItem('hisopadosPatients', JSON.stringify(arr_patients));
        }

        let sendData = {
            dni,
            service: 'HISOPADO',
            dependant: true,
            dependantData: {
                sex: data.sex,
                dob: data.dob,
                dni: data.dni,
                ws: data.ws,
                user: data.fullname
            },
            dependantDestination: {
                user_address: data.address,
                user_floor: data.piso,
                user_number: data.depto,
                // user_lat: lat,
                // user_lon: lng
            }
        }
          
        console.log(sendData);

        //   let headers = { 'Content-Type': 'Application/Json' }

        //   axios.post(cobertura, data, headers)
        //     .then(res => setAlert({ display: true, type: 'success', title: 'Aviso registrado!', customMessage: 'Te notificaremos cuando haya cobertura en tu zona' }))
        //     .catch(err => setAlert({ display: true, type: 'danger', title: 'No pudimos registrar su pedido', customMessage: 'Ocurrió un error inesperado. Intentelo más tarde.' }))
    }

    return (
        <article className="HisopadoCart__user">
            <div className="HisopadoCart__userTitle" onClick={() => {
                setOpenUser(!openUser);
            }}>
                <p className="HisopadoCart__userName">{data.fullname || data.title}</p>
                {
                !openUser ?
                <FaChevronDown /> :
                <FaChevronUp />

                }
            </div>
            <div className={`HisopadoCart__userData ${openUser ? 'open' : ''}`}>
                <div>
                    <label>Nombre y apellido</label>
                    <input 
                        type="text" 
                        value={data.fullname} 
                        onChange={(e) => {
                            setData({...data, title: e.target.value, fullname: e.target.value});
                        }}
                    />
                    <FaPencilAlt />
                </div>

                <div>
                    <label>Identificación, cédula o DNI</label>
                    <input 
                        type="text" 
                        value={data.dni} 
                        onChange={(e) => {
                            setData({...data, dni: e.target.value});
                        }}
                    />
                    <FaPencilAlt />
                </div>
                
                <div>
                    <label>N° de celular</label>
                    <input 
                        type="text" 
                        value={data.ws} 
                        onChange={(e) => {
                            setData({...data, ws: e.target.value});
                        }}
                    />
                    <FaPencilAlt />
                </div> 

                <div className="columns">
                    <div>
                        <label>Fecha de nacimiento</label>
                        <input 
                            type="date" 
                            value={data.dob} 
                            onChange={(e) => {
                                setData({...data, dob: e.target.value});
                            }}
                        />
                    </div>
                    <div>
                        <label>Sexo</label>
                        <select
                            value={data.sex} 
                            name="sexo"
                            onChange={(e) => {
                                setData({...data, sex: e.target.value});
                            }}
                        >
                            <option selected disabled>- Seleccionar -</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Observaciones</label>
                    <input 
                        type="text" 
                        placeholder="Aclaración para el personal médico" 
                        value={data.obs}
                        onChange={(e) => {
                            setData({...data, obs: e.target.value});
                        }}
                    />
                    <FaPencilAlt />
                </div>  

                <div>
                    <label>Domicilio</label>
                    <input 
                        type="text" 
                        value={data.address} 
                        onChange={(e) => {
                            setData({...data, address: e.target.value});
                        }}
                    />
                    <FaPencilAlt />
                </div> 

                <div className="columns">
                    <div>
                        <label>Piso</label>
                        <input 
                            type="text" 
                            value={data.piso} 
                            onChange={(e) => {
                                setData({...data, piso: e.target.value});
                            }}
                        />
                        <FaPencilAlt /> 
                    </div>
                    <div>
                        <label>Departamento</label>
                        <input 
                            type="text" 
                            value={data.depto} 
                            onChange={(e) => {
                                setData({...data, depto: e.target.value});
                            }}
                        />
                        <FaPencilAlt /> 
                    </div>
                </div>

                {
                    id !== 0 ?
                    <button className="HisopadoCart__btnAddress" onClick={() => setOpenModal(true)}>Cambiar domicilio</button> :
                    null
                }
                
                <button className="HisopadoCart__btnConfirm" onClick={handleConfirm}>Aceptar</button>
                <button className="HisopadoCart__btnDelete"><FaTrashAlt /></button>
            </div>

            {
                openModal &&
                <MobileModal callback={()=>setOpenModal(false)} surveyHisopados noScroll>
                    <DeliverySelectDestiny isModal />
                </MobileModal>
            }
        </article>
    )
}

export default HisopadoCartItem;