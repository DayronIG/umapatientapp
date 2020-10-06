import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Glucemia.scss";

const Glucemia = props => {
  let Total = props.resGlucemia[0].MEASURE;
  let resultado = (Total * 100) / 150;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";
  if (Total >= 110) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Glucemia
      </div>
      <div className="arrowContainer">
        <div className="itemsContainer">
          <div
            className="arrowStatus"
            style={{ position: "absolute", left: Valor, color: color }}
          >
            {Total} Mg/DL{" "}
          </div>
          <br></br>
          <div
            className="arrowItem"
            style={{ position: "absolute", left: Valor }}
          >
            {" "}
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>
      </div>
      <div className="barContainer">
        <div className="bar bar-a-gl">Bajo</div>
        <div className="bar bar-b-gl">Normal</div>
        <div className="bar bar-c-gl">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">25</div>
        </div>
        <div className="measure">
          <div className="dataMead">50</div>
        </div>
        <div className="measure">
          <div className="dataMead">75</div>
        </div>
        <div className="measure">
          <div className="dataMead">100</div>
        </div>
        <div className="measure">
          <div className="dataMead">125</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default Glucemia;
