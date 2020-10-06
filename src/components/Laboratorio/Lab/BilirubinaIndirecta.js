import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Styles/BilirubinaIndirecta.scss";

const BilirubinaIndirecta = props => {
  let Total = props.resBilirubinaIndirecta[0].MEASURE;
  let resultado = (Total * 100) / 5;
  if (resultado >= 90) {
    resultado = 85;
  }
  let Valor = `${resultado}%`;

  let color = "black";

  if (Total >= 0.7) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <div className="genericChart">
      <div className="title" style={{ color: color }}>
        Bilirubina Indirecta
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
        <div className="bar bar-b-dir">Normal</div>
        <div className="bar bar-c-dir">Alto</div>
      </div>
      <div className="rulerContainer">
        <div className="measure">
          <div className="dataMead">0.50</div>
        </div>
        <div className="measure">
          <div className="dataMead">0.70</div>
        </div>
        <div className="measure">
          <div className="dataMead">1.50</div>
        </div>
        <div className="measure">
          <div className="dataMead">2</div>
        </div>
        <div className="measure">
          <div className="dataMead">2.5</div>
        </div>
        <div className="measure">
          <div className="dataMead"></div>
        </div>
      </div>
    </div>
  );
};

export default BilirubinaIndirecta;
