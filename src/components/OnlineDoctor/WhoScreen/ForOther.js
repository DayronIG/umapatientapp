import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment-timezone";
import DB from '../../../config/DBConnection.js'
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { node_patient } from "../../../config/endpoints";
import Alert from "../../GeneralComponents/Alert/Alerts";
import Loading from "../../GeneralComponents/Loading";
import "../../../styles/generalcomponents/register.scss";
import swal from 'sweetalert';

const RegisterDependant = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);
  const {uid} = useSelector(state => state.userActive.currentUser);
  const front = useSelector(state => state.front);
  const loading = useSelector(state => state.front.loading);
  const [dependant, setDependant] = useState({ document: '', fullname: '', day: '', month: '', year: '', sex: '', cobertura: '' })
  const { dni, day, month,
    year, sex, address, piso, fullname } = useSelector(state => state.user);
  const monthRef = useRef();
  const yearRef = useRef();

  let handleSignUp = async (event, dependant) => {
    event.preventDefault();
    window.scroll(0, 0);
    dispatch({ type: "LOADING", payload: true });
    let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
    let dob = `${dependant.year}-${dependant.month}-${dependant.day}`;
    let data = {
      address: address || "",
      corporate: dependant.cobertura || "",
      dni: dependant.document || "",
      core_id: user.core_id || "",
      dob: dob || "",
      dt: date || "",
      fullname: dependant.fullname || "",
      group: user.dni || "",
      piso: piso || "",
      sex: dependant.sex || "",
      ws: user.ws || "",
    }
    try {
      //CAMBIAR-SANTI -> Devolver dato en el response (back)
      let activeUid = ''  
      const res = await axios.post(`${node_patient}/dependant`, { dependant: data })
      const registeredDependant = await DB.firestore()
        .collection(`user/${uid}/dependants`)
        .where('dni', '==', dependant.document)
        .get()
      registeredDependant.forEach((p) => {
        let id = p.id
        activeUid = id
      })
      if (props.redirectToConsultory === 'true') {
        history.replace(`/appointmentsonline/${activeUid}?dependant=true`)
      } else {
        let userData = { ...user, dni, dob, sex, fullname }
        localStorage.setItem('appointmentUserData', JSON.stringify(userData))
        history.replace(`/onlinedoctor/when/${activeUid}?dependant=true`)
      }
      dispatch({ type: "LOADING", payload: false })
    } catch(error) {
        console.log(error)
        swal("No se pudo registrar", `No se pudo completar tu registro. ${JSON.stringify(error?.response?.data?.message)}`, "warning")
        dispatch({ type: "LOADING", payload: false })
    }
    // axios
    //   .post(`${node_patient}/dependant`, { dependant: data })
    //   .then(res => {
    //     if (props.redirectToConsultory === 'true') {
    //       history.replace(`/appointmentsonline/${dni}`)
    //     } else {
    //       let userData = { ...user, dni, dob, sex, fullname }
    //       localStorage.setItem('appointmentUserData', JSON.stringify(userData))
    //       history.replace(`/onlinedoctor/when/${data.dni}`)
    //     }
    //     dispatch({ type: "LOADING", payload: false })
    //   })
      // .catch(function (error) {
      //   swal("No se pudo registrar", `No se pudo completar tu registro. ${JSON.stringify(error?.response?.data?.message)}`, "warning")
      //   dispatch({ type: "LOADING", payload: false })
      // })
  }

  const onChangeDay = e => {
    setDependant({ ...dependant, day: e.target.value })
    if (e.target.value.length === 2) {
      monthRef.current.focus()
    }
  }

  const onChangeMonth = e => {
    setDependant({ ...dependant, month: e.target.value })
    if (e.target.value.length === 2) {
      yearRef.current.focus()
    }
  }

  const handleDni = (dni) => {
    const reg = /^\d+$/
    const str = dni.toString()
    const isNumber = reg.test(str)
    if (isNumber) setDependant({ ...dependant, document: dni })
    else if (!dni) setDependant({ ...dependant, document: '' })
  }

  return (
    <div className="register__container">
      {loading && <Loading />}
      {front.alert.active && (
        <Alert
          alertType={front.alert.type}
          titleMessage={front.alert.title}
          customMessage={front.alert.msg}
        />
      )}
      <form className="registerWrapper register-form" onSubmit={e => handleSignUp(e, dependant)}>
        <div className="registerContainerProps">
          <label className='form-label' htmlFor='name'>
            Nombre y Apellido
          </label>
          <input className="form-input" id="name" placeholder="Nombre y Apellido" required type="text"
            onChange={e => setDependant({ ...dependant, fullname: e.target.value })} value={dependant.fullname} />
          <label className='form-label' htmlFor='dni'>
            Identificación, cédula o DNI
          </label>
          <input
            className='form-input' id='dni' placeholder='e.g. 34111111' autoComplete='on'
            onChange={e => handleDni(e.target.value)} value={dependant.dni} required />
          <div className="d-flex justify-content-start">
            <div className="birthContainer w-50">
              <label className="form-label birthLabel" htmlFor="bday">
                Fecha de nacimiento
              </label>
              <div className="d-flex birthInputContainer">
                <input className="form-mid-input mr-2" maxLength="2"
                  type="number" max="31" name="bday" required="required"
                  id="dateDay" placeholder={day || "01"}
                  onChange={e => onChangeDay(e)}
                />
                <input className="form-mid-input mr-2" maxLength="2"
                  type="number" max="12" name="bMonth"
                  required="required" id="dateMonth"
                  ref={monthRef} placeholder={month || "01"}
                  onChange={e => onChangeMonth(e)} />
                <input
                  className="form-mid-input mr-2" maxLength="4"
                  ref={yearRef}
                  placeholder={year || "2000"}
                  type="number"
                  min="1900" max="2020"
                  name="bYear" required="required" id="dateYear"
                  onChange={e => setDependant({ ...dependant, year: e.target.value })} value={dependant.year} />
              </div>
            </div>
            <div className="sexContainer w-50">
              <label className="form-label gender">Género</label>
              <select className="form-mid-input" style={{ height: "65%" }}
                id="gender" required
                onChange={e => setDependant({ ...dependant, sex: e.target.value })} value={dependant.sex} >
                <option defaultValue>Sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          <label className="form-label birthLabel" htmlFor="bday">
            Cobertura de salud/Obra social/Prepaga/Seguro
          </label>
          <input
            className="form-input" id="os" placeholder="Cobertura de salud/Obra social/Prepaga/Seguro"
            autoComplete="off" type="text" required
            onChange={e => setDependant({ ...dependant, cobertura: e.target.value })} value={dependant.cobertura}
          />
        </div>
        <div className="col-sm-12 text-right">
          <button className="btn sendButtonStyles" type="submit">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterDependant;
