import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/BilirubinaDirecta.scss";

const BilirubinaDirecta = props => {
  let Total = props.resBilirubinaDirecta[0].MEASURE;
  let resultado = (Total * 100) / 2;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";

  if (Total >= 0.5) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Bilirubina Directa
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
        <div className="bar bar-b-bile">Normal</div>
        <div className="bar bar-c-bile">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">0.25</div>
        </div>
        <div className="measure">
          <div className="dataMead">0.50</div>
        </div>
        <div className="measure">
          <div className="dataMead">0.75</div>
        </div>
        <div className="measure">
          <div className="dataMead">1</div>
        </div>
        <div className="measure">
          <div className="dataMead">1.25</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default BilirubinaDirecta;
