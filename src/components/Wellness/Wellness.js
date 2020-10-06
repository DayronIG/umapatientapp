import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { start_biomarker } from "../../config/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faHeartbeat,
  faDeaf,
  faFileMedicalAlt,
  faInfo,
  faAllergies,
  faBriefcaseMedical
} from "@fortawesome/free-solid-svg-icons";
import { GenericHeader } from "../GeneralComponents/Headers";
import FooterBtn from "../GeneralComponents/FooterBtn";
import Backbutton from "../GeneralComponents/Backbutton";
import MobileModal from "../GeneralComponents/Modal/MobileModal";
import FileService from "../GeneralComponents/SelectService/FileService";
import Axios from "axios";
import lungs from "../../assets/icons/lungs.svg";
import WellnessCard from "../../assets/checkout/wellness.png";
import "../../styles/wellness/wellness.scss";

const Wellness = props => {
  const { dni, ws } = useSelector(state => state.queries.patient);
  const dispatch = useDispatch();
  const [modalFile, setModalFile] = React.useState({
    state: false,
    title: "biomarker",
    description: ""
  });
  const biomarkerHandler = biomarker =>
    setModalFile({ state: true, title: biomarker });

  return (
    <>
      {modalFile.state && (
        <MobileModal callback={() => setModalFile(!modalFile.state)}>
          <FileService
            type="biomarker"
            title={modalFile.title}
            description={modalFile.description}
          />
        </MobileModal>
      )}
      <div className="biomarkers">
        <div className="biomarkers__comingSoon">
          <div className="biomarkers__comingSoon--title">
            <img src={WellnessCard} alt="Bienestar" />
          </div>
        </div>
        <div className="biomarkers__container">
          <div className="biomarkers__container--list">
            <ul className="markers">
              <li className="markers__item">
                <Link to={`/${dni}/laboratorio`}>
                  <div className="markers__item--icon active">
                    <FontAwesomeIcon icon={faFileMedicalAlt} />
                    <div className="markers__item--info">
                      <FontAwesomeIcon icon={faInfo} />
                    </div>
                  </div>
                </Link>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("sthethoscop")}
              >
                <div className="markers__item--icon">
                  <FontAwesomeIcon icon={faStethoscope} />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("heartbeat")}
              >
                <div className="markers__item--icon">
                  <FontAwesomeIcon icon={faHeartbeat} />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("frank")}
              >
                <div className="markers__item--icon">
                  <FontAwesomeIcon icon={faDeaf} />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("lungs")}
              >
                <div className="markers__item--icon">
                  <img src={lungs} alt="Respiratorias" />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("allergies")}
              >
                <div className="markers__item--icon">
                  <FontAwesomeIcon icon={faAllergies} />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
              <li
                className="markers__item"
                onClick={() => biomarkerHandler("laringitis")}
              >
                <div className="markers__item--icon">
                  <FontAwesomeIcon icon={faBriefcaseMedical} />
                  <div className="markers__item--info">
                    <FontAwesomeIcon icon={faInfo} />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <FooterBtn
        mode="single"
        text="Volver"
        callback={() => props.history.push("/")}
      />
    </>
  );
};

export default withRouter(Wellness);
