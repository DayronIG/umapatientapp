import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/BilirubinaTotal.scss";

const BilirubinaTotal = props => {
  let Total = props.resBilirubinaTotal[0].MEASURE;
  let resultado = (Total * 100) / 1.5;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";

  if (Total >= 1.2) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Bilirubina Total
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
        <div className="bar bar-b-tot">Normal</div>
        <div className="bar bar-c-tot">Alto</div>
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
          <div className="dataMead">1.00 </div>
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

export default BilirubinaTotal;
