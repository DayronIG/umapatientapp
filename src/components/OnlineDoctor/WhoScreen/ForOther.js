import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { afiliado } from "../../../config/endpoints";
import DBConnection from "../../../config/DBConnection";
import Alert from "../../GeneralComponents/Alert/Alerts";
import Loading from "../../GeneralComponents/Loading";
import BackButton from '../../GeneralComponents/Backbutton';
// import { getPatientData } from "../../../store/actions/firebaseQueries";
// import app from "../../../config/DBConnection";
// import { GenericHeader } from "../../GeneralComponents/Headers";
// import MobileModal from "../../GeneralComponents/Modal/MobileModal";
import "../../../styles/generalcomponents/register.scss";

const Register = props => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.userActive.token)
  const user = useSelector(state => state.queries.patient);
  const front = useSelector(state => state.front);
  const loading = useSelector(state => state.front.loading);
  const isTransport =
    props.history.location.pathname.split("/").pop() === "transport";
  const { dni, dni_titular, email, day, month,
    year, date, sex, address, city, piso, ws, os, fullname } = useSelector(state => state.register);
  const monthRef = useRef();
  const yearRef = useRef();

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
      address: address || "", // getAddress.concat(", " + getCity) ||
      core_id: "",
      corporate: os || "",
      dni_titular: user.dni || "",
      dni: dni || "",
      dob: dob || "",
      dt: date || "",
      email: user.email || "",
      fullname: fullname || "",
      piso: piso || "", // getPiso ||
      sex: sex || "",
      ws: user.ws || ""
    }
    console.log(data)
    let headers = { ContentType: "Application/json"/*, 'Authorization': token */ };
    axios
      .post(afiliado, data, headers)
      .then(res => {
        if (props.redirectToConsultory === 'true') {
          props.history.replace(`/${dni}/appointmentsonline/`)
        } else {
          let userData = { ...user, dni, dob, sex, fullname }
          localStorage.setItem('appointmentUserData', JSON.stringify(userData))
          props.history.replace(`/${data.dni}/onlinedoctor/when`)
        }
        dispatch({ type: "LOADING", payload: false })
      })
      .catch(function (error) {
        dispatch({
          type: "ALERT",
          payload: {
            type: "warning",
            title: "No se pudo registrar",
            msg:
              "No se pudo completar su registro."
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

  const handleDni = (dni) => {
    const reg = /^\d+$/
    const str = dni.toString()
    const isNumber = reg.test(str)
    if (isNumber) dispatch({ type: 'REGISTER_FIRST_DNI', payload: dni })
    else if (!dni) dispatch({ type: 'REGISTER_FIRST_DNI', payload: '' })
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
      <form className="registerWrapper register-form" onSubmit={e => handleSignUp(e)}>
      <BackButton />
        <div className="registerContainerProps">
          <input className="form-input" id="name" placeholder="Nombre y apellido" required
            autoComplete="on" type="text"
            onChange={e => dispatch({ type: "REGISTER_FIRST_FULLNAME", payload: e.target.value })} />
          <label className='form-label' htmlFor='dni'>
              Identificación, cédula o DNI
          </label>
          <input
              className='form-input' id='dni' placeholder='e.g. 34111111' autoComplete='on'
              onChange={e => handleDni(e.target.value)} value={dni || ''} required />
         <div className="d-flex justify-content-start">
            <div className="birthContainer w-50">
              <label className="form-label birthLabel">
                Fecha de nacimiento
              </label>
              <div className="d-flex birthInputContainer">
                <input className="form-mid-input mr-2" maxLength="2"
                  type="number" max="31" name="bday" required="required"
                  id="dateDay" placeholder={day}
                  onChange={e => onChangeDay(e)}
                />
                <input className="form-mid-input mr-2" maxLength="2"
                  type="number" max="12" name="bMonth"
                  required="required" id="dateMonth"
                  ref={monthRef} placeholder={month}
                  onChange={e => onChangeMonth(e)} />
                <input
                  className="form-mid-input mr-2" maxLength="4"
                  ref={yearRef}
                  placeholder={year}
                  type="number"
                  min="1900" max="2020"
                  name="bYear" required="required" id="dateYear"
                  onChange={e => {
                    dispatch({ type: "REGISTER_FIRST_YEAR", payload: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="sexContainer w-50">
              <label className="form-label gender">Género</label>
              <select className="form-mid-input" style={{ height: "65%" }}
                id="gender" required
                onChange={e => dispatch({ type: "REGISTER_FIRST_SEX", payload: e.target.value })} >
                <option defaultValue>Sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          <input
            className="form-input" id="os" placeholder="Obra social/Prepaga/Seguro"
            autoComplete="off" type="text" required
            onChange={e => dispatch({ type: "REGISTER_FIRST_OS", payload: e.target.value })}
          />
        </div>
        <div className="col-sm-12 text-right">
          <button className="btn sendButtonStyles" type="submit">
            Enviar
          </button>
        </div>
      </form>
    </>
  );
};

export default withRouter(Register);
