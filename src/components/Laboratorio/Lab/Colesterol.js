import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Colesterol.scss";

const Colesterol = props => {
  let Total = props.resColesterol[0].MEASURE;
  let resultado = (Total * 100) / 300;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";
  if (Total >= 200) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Colesterol
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
        <div className="bar bar-a">Bajo</div>
        <div className="bar bar-b">Normal</div>
        <div className="bar bar-c">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">50</div>
        </div>
        <div className="measure">
          <div className="dataMead">100</div>
        </div>
        <div className="measure">
          <div className="dataMead">150</div>
        </div>
        <div className="measure">
          <div className="dataMead">200</div>
        </div>
        <div className="measure">
          <div className="dataMead">250</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default Colesterol;
