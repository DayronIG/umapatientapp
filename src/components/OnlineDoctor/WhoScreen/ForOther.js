import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { node_patient } from "../../../config/endpoints";
import Alert from "../../GeneralComponents/Alert/Alerts";
import Loading from "../../GeneralComponents/Loading";
import { GenericHeader } from "../../GeneralComponents/Headers";
import "../../../styles/generalcomponents/register.scss";

const Register = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const front = useSelector(state => state.front);
  const loading = useSelector(state => state.front.loading);
  const { dni,  day, month,
    year, sex, address, piso, os, fullname } = useSelector(state => state.user);
  const monthRef = useRef();
  const yearRef = useRef();

  useEffect(() => {
    localStorage.setItem("userRegistered", props.match.params.ws);
    let ws = localStorage.getItem("userRegistered");
    let dni = localStorage.getItem("userId");
    dispatch({ type: "USER_FIRST_DNI", payload: dni });
    dispatch({ type: "USER_FIRST_WS", payload: ws });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let composeDate = () => {
    let buildDate = new Date(month + "/" + day + "/" + year);
    let birth = moment(buildDate).format("YYYY-MM-DD");
    let date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    dispatch({ type: "USER_FIRST_DOB", payload: birth });
    dispatch({ type: "USER_FIRST_DT", payload: date });
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
              `No se pudo completar tu registro. ${error?.response?.data?.message}`
          }
        })
        dispatch({ type: "LOADING", payload: false })
      })
  }

  const onChangeDay = e => {
    dispatch({ type: "USER_FIRST_DAY", payload: e.target.value });
    if (e.target.value.length === 2) {
      monthRef.current.focus()
    }
  }

  const onChangeMonth = e => {
    dispatch({ type: "USER_FIRST_MONTH", payload: e.target.value });
    if (e.target.value.length === 2) {
      yearRef.current.focus()
    }
  }

  const handleDni = (dni) => {
    const reg = /^\d+$/
    const str = dni.toString()
    const isNumber = reg.test(str)
    if (isNumber) dispatch({ type: 'USER_FIRST_DNI', payload: dni })
    else if (!dni) dispatch({ type: 'USER_FIRST_DNI', payload: '' })
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
      <form className="registerWrapper register-form" onSubmit={e => handleSignUp(e)}>
        <div className="registerContainerProps">
          <input className="form-input" id="name" placeholder="Nombre y apellido" required
            autoComplete="on" type="text"
            onChange={e => dispatch({ type: "USER_FIRST_FULLNAME", payload: e.target.value })} />
          <label className='form-label' htmlFor='dni'>
              Identificación, cédula o DNI
          </label>
          <input
              className='form-input' id='dni' placeholder='e.g. 34111111' autoComplete='on'
              onChange={e => handleDni(e.target.value)} value={dni} required />
         <div className="d-flex justify-content-start">
            <div className="birthContainer w-50">
              <label className="form-label birthLabel">
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
                  onChange={e => {
                    dispatch({ type: "USER_FIRST_YEAR", payload: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="sexContainer w-50">
              <label className="form-label gender">Género</label>
              <select className="form-mid-input" style={{ height: "65%" }}
                id="gender" required
                onChange={e => dispatch({ type: "USER_FIRST_SEX", payload: e.target.value })} >
                <option defaultValue>Sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          <input
            className="form-input" id="os" placeholder="Obra social/Prepaga/Seguro"
            autoComplete="off" type="text" required
            onChange={e => dispatch({ type: "USER_FIRST_OS", payload: e.target.value })}
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

export default withRouter(Register);
