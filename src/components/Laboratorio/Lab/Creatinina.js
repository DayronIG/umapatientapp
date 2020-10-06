import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Creatinina.scss";

const Creatinina = props => {
  let Total = props.resCreatinina[0].MEASURE;
  let resultado = (Total * 100) / 3;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";
  if (Total >= 1.4) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Creatinina
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
        <div className="bar bar-a-crea">Bajo</div>
        <div className="bar bar-b-crea">Normal</div>
        <div className="bar bar-c-crea">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">0.50</div>
        </div>
        <div className="measure">
          <div className="dataMead">1.00</div>
        </div>
        <div className="measure">
          <div className="dataMead">1.50</div>
        </div>
        <div className="measure">
          <div className="dataMead">2.00</div>
        </div>
        <div className="measure">
          <div className="dataMead">2.50</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default Creatinina;
