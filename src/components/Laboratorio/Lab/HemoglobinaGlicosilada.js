import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/HemoglobinaGlicosilada.scss";

const HemoglobinaGlicosilada = props => {
  let Total = props.resHemoglobinaG[0].MEASURE;
  let resultado = (Total * 100) / 12;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";
  if (Total >= 4) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Hemoglobina Glicosilada
      </div>
      <div className="arrowContainer">
        <div className="itemsContainer">
          <div
            className="arrowStatus"
            style={{ position: "absolute", left: Valor, color: color }}
          >
            {Total} %{" "}
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
        <div className="bar bar-a-gli">Bajo</div>
        <div className="bar bar-b-gli">Normal</div>
        <div className="bar bar-c-gli">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">2%</div>
        </div>
        <div className="measure">
          <div className="dataMead">4%</div>
        </div>
        <div className="measure">
          <div className="dataMead">6%</div>
        </div>
        <div className="measure">
          <div className="dataMead">8%</div>
        </div>
        <div className="measure">
          <div className="dataMead">10%</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default HemoglobinaGlicosilada;
