import React from "react";
import { GenericHeader } from "../components/GeneralComponents/Headers";
import Vmd from "../components/VMD";
import Backbutton from '../components/GeneralComponents/Backbutton';

const VMD = props => {
  return (
    <>
      <GenericHeader
        onClick={() => {
          props.history.go(`/${props.match.params.dni}/`);
        }}
      >
        Visita Médica Domiciliaria
      </GenericHeader>
      <Backbutton />
      <Vmd />
    </>
  );
};

export default VMD;
