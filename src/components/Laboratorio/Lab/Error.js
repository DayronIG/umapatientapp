import React from "react";

const Error = props => {
  console.log(props.resPost[0].tags);
  return (
    <div className="error">
      <h5>
        No se Puede Procesar esta Imagen Porfavor intente Nuevamente Con otra
        imagen
      </h5>
    </div>
  );
};

export default Error;
