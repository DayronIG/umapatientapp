import React from "react";
import { useSelector } from "react-redux";
import { GenericHeader } from "../../GeneralComponents/Headers";
import Loading from "../../GeneralComponents/Loading";
import "../../../styles/dinamic.scss";
// import BackButton from '../../GeneralComponents/Backbutton';

const DinamicScreen = props => {
  const loading = useSelector(state => state.front.loading);
  const userDataToJson = JSON.parse(localStorage.getItem('userData'));
  return (
    <div className="dinamic-template">
      <GenericHeader children={userDataToJson?.fullname} />
      {loading ? (
        <Loading />
      ) : (
          <div className="dinamic-content-container">{props.children}</div>
        )}
    </div>
  );
};

export default DinamicScreen;
