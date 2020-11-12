import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { node_patient } from "../../../config/endpoints";
import Alert from "../../GeneralComponents/Alert/Alerts";
import Loading from "../../GeneralComponents/Loading";
import BackButton from './../../GeneralComponents/Backbutton';
import "../../../styles/generalcomponents/register.scss";
import '../../../styles/deliveryService/forOtherHisopados.scss';

const Register = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.queries.patient);
  const front = useSelector(state => state.front);
  const loading = useSelector(state => state.front.loading);
  const { dni,  day, month, phone,
    year, sex, address, piso, depto, os, fullname } = useSelector(state => state.register);
  const monthRef = useRef();
  const yearRef = useRef();
  const generoRef = useRef();
  useEffect(() => {
    localStorage.setItem("userRegistered", props.match.params.ws);
    let ws = localStorage.getItem("userRegistered");
    let dni = localStorage.getItem("userId");
    dispatch({ type: "REGISTER_FIRST_DNI", payload: dni });
    dispatch({ type: "REGISTER_FIRST_WS", payload: ws });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let composeDate = () => {
    let buildDate = new Date(month + "/" + day + "/" + year);
    let birth = moment(buildDate).format("YYYY-MM-DD");
    let date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    dispatch({ type: "REGISTER_FIRST_DOB", payload: birth });
    dispatch({ type: "REGISTER_FIRST_DT", payload: date });
  };

  let handleSignUp = (event) => {
    event.preventDefault();
    window.scroll(0, 0);
    dispatch({ type: "LOADING", payload: true });
    composeDate();
    let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
    let dob = `${year}-${month}-${day}`;
    let data = {
      address: address || "", 
      corporate: os || "",
      corporate_norm: os || "",
      dni: dni || "",
      dob: dob || "",
      dt: date || "",
      fullname: fullname || "",
      group: user.dni || "",
      piso: piso || "", 
      sex: sex || "",
      ws: user.ws || "",
    } 
    axios
      .post(`${node_patient}/dependant`, {dependant: data})
      .then(res => {
          props.history.replace(`/hisopado/carrito/${dni}`)
        dispatch({ type: "LOADING", payload: false })
      })
      .catch(function (error) {
        dispatch({
          type: "ALERT",
          payload: {
            type: "warning",
            title: "No se pudo registrar",
            msg:
              `No se pudo completar tu registro. ${error?.response?.data?.message}`
          }
        })
        dispatch({ type: "LOADING", payload: false })
      })
  }

  const onChangeDay = e => {
    dispatch({ type: "REGISTER_FIRST_DAY", payload: e.target.value });
    if (e.target.value.length === 2) {
      monthRef.current.focus()
    }
  }

  const onChangeMonth = e => {
    dispatch({ type: "REGISTER_FIRST_MONTH", payload: e.target.value });
    if (e.target.value.length === 2) {
      yearRef.current.focus()
    }
  }

  const onChangeYear = e => {
    dispatch({ type: "REGISTER_FIRST_YEAR", payload: e.target.value });
    if (e.target.value.length === 4) {
      generoRef.current.focus()
    }
  }

  const handleDni = (dni) => {
    const reg = /^\d+$/
    const str = dni.toString()
    const isNumber = reg.test(str)
    if (isNumber) dispatch({ type: 'REGISTER_FIRST_DNI', payload: dni })
    else if (!dni) dispatch({ type: 'REGISTER_FIRST_DNI', payload: '' })
  }

  const handlePhoneNumber = e => {
    dispatch({ type: 'REGISTER_PHONE_NUMBER', payload: e.target.value})
  }

  const handlePiso = e =>{
    dispatch({ type: 'REGISTER_FIRST_PISO', payload: e.target.value})
  }

  const handleDepto = e =>{
    dispatch({ type: 'REGISTER_FIRST_DEPTO', payload: e.target.value})
  }

  return (
    <>

      {loading && <Loading />}
      {front.alert.active && (
        <Alert
          alertType={front.alert.type}
          titleMessage={front.alert.title}
          customMessage={front.alert.msg}
        />
      )}
      
      <form className="forOTherHisopado" onSubmit={e => handleSignUp(e)}>
      <BackButton />
      <h1 className="title">Datos del Usuario</h1>
      <div className="message">Necesitamos que completes el siguiente formulario con los datos de la persona que será hisopada.</div>
        
          <div className="inputContainer">
          <label className='form-label'>Nombre y Apellido</label>
          <input className="form-input" id="name" placeholder="Juan Perez" required
            autoComplete="on" type="text"
            onChange={e => dispatch({ type: "REGISTER_FIRST_FULLNAME", payload: e.target.value })} />
            </div>
            <div className="inputContainer">
          <label className='form-label' htmlFor='dni'>
              Identificación, cédula o DNI
          </label>
          <input
             type="text" className='form-input' id='dni' placeholder='27097652' autoComplete='on'
              onChange={e => handleDni(e.target.value)} value={dni} required />
              </div>
              <div className="inputContainer">
          <label className='form-label' htmlFor='phoneNumber'>
              N° de celular
          </label>
          <input
              className='form-input' id='phoneNumber' placeholder='54 11 000 0000' autoComplete='on'
              onChange={e => handlePhoneNumber(e)} value={phone} required />
              </div>
         <div className="mid-inputs-container">
            <div className="inputContainer">
              <label className="form-label">
                Fecha de nacimiento
              </label>
              <div className="birthInputContainer">
                <input type="number" placeholder="00"   onChange={(e) => onChangeDay(e)} value={day}  required className='form-input birth' id='birthDate'
               required />
              <input type="number" placeholder="00"  ref={monthRef} onChange={(e) => onChangeMonth(e)} value={month} min="1" max="12" required className='form-input birth' id='birthDate'
               required />
              <input type="number" placeholder="0000" ref={yearRef} onChange={(e) => onChangeYear(e)} value={year} required className='form-input birth' id='birthDate'
               required />
              </div>
              
            </div>
            <div className="inputContainer genero">
              <label className="form-label">Género</label>
              <select ref={generoRef} className="form-input genero"
                id="gender" required
                value={sex}
                onChange={e => dispatch({ type: "REGISTER_FIRST_SEX", payload: e.target.value })} >
                <option defaultValue>-</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          
          <div className="inputContainer">
          <label className='form-label'>Domicilio</label>
          <input
            className="form-input" id="domicilio" placeholder="Adolfo ALsina 2530, CABA"
            autoComplete="off" type="text" required
            // onChange={e => dispatch({ type: "REGISTER_FIRST_OS", payload: e.target.value })}
          />
          </div>
        
        
          
        <div className="mid-inputs-container">
        <div className="inputContainer">
          <label className='form-label'>Piso</label>
          <input onChange={e => handlePiso(e)} value={piso} className="form-input mid-input" type="text" id="piso"/>
        </div>
        <div className="inputContainer mid">
          <label className='form-label'>Depto</label>
          <input onChange={e => handleDepto(e)} value={depto} className="form-input mid-input" type="text" id="depto"/>
        </div>
        </div>

        <div className="btnContainer">
          <button className="btn" type="submit">
            Aceptar
          </button>
        </div>
        
      </form>
    </>
  );
};

export default withRouter(Register);
