import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faBan,
  faExclamationTriangle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/alert.scss";
// structure for calling component -> 
// <AlertComponent alertType="success" titleMessage="" customMessage="" customAction={cb} handleConfirm={cb} handleReject={cb} />
//
const AlertComponent = props => {
  const dispatch = useDispatch();
  const data = {
    type: "",
    title: "",
    msg: ""
  };

  let unsetModal = () => {
    // dispatch({ type: "ALERT", payload: data });
    if (props.customAction) {
      props.customAction()
    }
  };

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      if (props.customAction) {
        props.customAction()
      }
    }, 6000)
    return () => clearTimeout(alertTimer)
  }, [])

  switch (props.alertType) {
    case "success":
      return (
        <section className="alertModal">
          <div className="modalContainer success d-flex">
            <div className="iconLeft">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <div className="textContainer">
              <span className="titleContainer">
                {props.titleMessage}
                {props.titleMessage ? ": " : ""}
              </span>
              <span className="messageContainer">{props.customMessage}</span>
            </div>
            <div className="alertClose" onClick={unsetModal}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        </section>
      );
    case "warning":
      return (
        <section className="alertModal">
          <div className="modalContainer warning d-flex">
            <div className="iconLeft">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="textContainer">
              <span className="titleContainer">{props.titleMessage}. </span>
              <span className="messageContainer">{props.customMessage}</span>
            </div>
            <div className="alertClose" onClick={unsetModal}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        </section>
      );
    case "danger":
      return (
        <section className="alertModal">
          <div className="modalContainer danger d-flex">
            <div className="iconLeft">
              <FontAwesomeIcon icon={faBan} />
            </div>
            <div className="textContainer">
              <span className="titleContainer">{props.titleMessage}. </span>
              <span className="messageContainer">{props.customMessage}</span>
            </div>
            <div className="alertClose" onClick={unsetModal}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        </section>
      );
    case "info":
      return (
        <section className="alertModal">
          <div className="modalContainer info d-flex">
            <div className="iconLeft">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <div className="textContainer">
              <span className="titleContainer">{props.titleMessage} </span>
              <span className="messageContainer">{props.customMessage}</span>
            </div>
            <div className="alertClose" onClick={unsetModal}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        </section>
      );
    case "question":
      return (
        <section className="alertModal">
          <div className="modalContainer info">
            <div className="d-flex">
              <div className="iconLeft">
                <FontAwesomeIcon icon={faExclamationCircle} />
              </div>
              <div className="textContainer">
                <span className="titleContainer">{props.titleMessage}: </span>
                <span className="messageContainer">{props.customMessage}</span>
              </div>
              <div className="alertClose" onClick={unsetModal}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            <div className="questionOptions d-flex">
              <button
                className="btn btn-active"
                onClick={() => props.handleConfirm()}
              >
                Si
              </button>
              <button
                className="btn btn-active"
                onClick={() => props.handleReject()}
              >
                No
              </button>
            </div>
          </div>
        </section>
      );
    default:
      return "";
  }
};

export default AlertComponent;
