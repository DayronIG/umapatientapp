import React, { useState, useEffect, useRef } from "react";
import {useSelector} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {ocr_labo} from '../../../config/endpoints';
import axios from "axios";
import HemoglobinaGlicosilada from "./HemoglobinaGlicosilada";
import Creatinina from "./Creatinina";
import Colesterol from "./Colesterol";
import Glucemia from "./Glucemia";
import Ldl from "./Ldl";
import BilirubinaTotal from "./BilirubinaTotal";
import BilirubinaDirecta from "./BilirubinaDirecta";
import BilirubinaIndirecta from "./BilirubinaIndirecta";
import Error from "./Error";
import Triglicerido from "./Trigliceridos";
import { Loader } from "../../global/Spinner/Loaders";
import moment from "moment-timezone";
import { FaUpload } from "react-icons/fa"

import "./Styles/Buttons.scss";

function LoadAnalysis(props) {
  const patient = useSelector(state => state.user)
  const token = useSelector(state => state.userActive.token)
  const [resPost, setResPost] = useState("");
  const [resspiner, setresspiner] = useState(false);
  const [resCarga, setResCarga] = useState(false);
  const [resHemoglobinaG, SetresHemoglobinaG] = useState("");
  const [resCreatinina, SetresCreatinina] = useState("");
  const [resBilirubinaDirecta, SetresBilirubinaDirecta] = useState("");
  const [resBilirubinaIndirecta, SetresBilirubinaIndirecta] = useState("");
  const [resBilirubinaTotal, SetresBilirubinaTotal] = useState("");
  const [resColesterol, SetresColesterol] = useState("");
  const [resGlucemia, SetresGlucemia] = useState("");
  const [resLdl, SetresLdl] = useState("");
  const [resTrigliceridos, SetresTrigliceridos] = useState("");
  const [resImagen, SetresImagen] = useState("");
  const inputRef = useRef();

  const handleClickInputFile = () => {
    inputRef.current.click();
  };

  //const fecha = moment().tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
  let fecha = new Date();
  fecha = moment()
    .tz("America/Argentina/Buenos_Aires")
    .format("YYYY-MM-DD HH:mm:ss");

  const handleFileChange = event => {
    setResCarga(true)
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = function () {
      const imgB64 = reader.result;
      postImg(imgB64.split("base64,")[1]);
    };
  };

  function postImg(img) {
    setresspiner(true);
    const datos = {
      labo_b64: img,
    };
    let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': token */ }
    axios
      .post(ocr_labo, datos, headers)
      .then(res => {
        setResPost(res.data);
        console.log(res);
        setresspiner(false);
      })
      .catch(e => {
        setResPost(e);
        console.error(e);
        setresspiner(false);

        alert(
          "Ocurrió un error inesperado, por favor vuelva a intentar más tarde."
        );
      });
  }

  useEffect(() => {
    if (resPost.path_docu !== "") {
      try {
        let datos = resPost.tabla;
        datos = JSON.parse(datos);
        console.table(datos);

        let Colesterol = "";
        Colesterol = datos.filter(busqueda => busqueda.SYMBOL === "COLESTEROL");
        SetresColesterol(Colesterol);

        let Glucemia = "";
        Glucemia = datos.filter(busqueda => busqueda.SYMBOL === "GLUCEMIA");
        SetresGlucemia(Glucemia);

        let Ldl = "";
        Ldl = datos.filter(busqueda => busqueda.SYMBOL === "LDL");
        SetresLdl(Ldl);

        let HemoglobinaG = "";
        HemoglobinaG = datos.filter(
          busqueda => busqueda.SYMBOL === "HEMOGLOBINA GLICOSILADA"
        );
        SetresHemoglobinaG(HemoglobinaG);

        let Creatinina = "";
        Creatinina = datos.filter(busqueda => busqueda.SYMBOL === "CREATININA");

        SetresCreatinina(Creatinina);

        let BilirubinaDirecta = "";
        BilirubinaDirecta = datos.filter(
          busqueda => busqueda.SYMBOL === "BILIRRUBINA DIRECTA"
        );

        SetresBilirubinaDirecta(BilirubinaDirecta);

        let BilirubinaIndirecta = "";
        BilirubinaIndirecta = datos.filter(
          busqueda => busqueda.SYMBOL === "BILIRRUBINA INDIRECTA"
        );

        SetresBilirubinaIndirecta(BilirubinaIndirecta);

        let BilirubinaTotal = "";
        BilirubinaTotal = datos.filter(
          busqueda => busqueda.SYMBOL === "BILIRRUBINA TOTAL"
        );
        SetresBilirubinaTotal(BilirubinaTotal);

        let Trigliceridosl = "";
        Trigliceridosl = datos.filter(
          busqueda => busqueda.SYMBOL === "TRIGLICERIDOS"
        );

        SetresTrigliceridos(Trigliceridosl);
      } catch (error) { }
    } else {
      console.log("No se identificaron marcadores")
    }
  }, [resPost]);

  return (
    <>
      <div className="load__input">
        <input type="file" id="files" accept="image/*"
          onChange={handleFileChange}
          placeholder="subir"
          style={{display: "none"}}
          ref={inputRef} />
        <div className="btn-blue-lg" onClick={() => handleClickInputFile()}>Selecciona un archivo <FaUpload className="icon" /></div>
        <label htmlFor="files">Sacar foto o adjuntar documento</label>
      </div>
      <br></br>
      {resCarga &&
        <div className="General items">
          <table className="tableprincipal">
            <tr>{resspiner && <Loader />}</tr>
            <tr>
              <div className="graficos">
                {resHemoglobinaG.length > 0 ? (
                  <HemoglobinaGlicosilada resHemoglobinaG={resHemoglobinaG} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resCreatinina.length > 0 ? (
                  <Creatinina resCreatinina={resCreatinina} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resBilirubinaIndirecta.length > 0 ? (
                  <BilirubinaIndirecta
                    resBilirubinaIndirecta={resBilirubinaIndirecta}
                  />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resBilirubinaDirecta.length > 0 ? (
                  <BilirubinaDirecta
                    resBilirubinaDirecta={resBilirubinaDirecta}
                  />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resBilirubinaTotal.length > 0 ? (
                  <BilirubinaTotal resBilirubinaTotal={resBilirubinaTotal} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resColesterol.length > 0 ? (
                  <Colesterol resColesterol={resColesterol} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resTrigliceridos.length > 0 ? (
                  <Triglicerido resTrigliceridos={resTrigliceridos} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resGlucemia.length > 0 ? (
                  <Glucemia resGlucemia={resGlucemia} />
                ) : (
                    <di></di>
                  )}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resLdl.length > 0 ? <Ldl resLdl={resLdl} /> : <div></div>}
              </div>
            </tr>
            <tr>
              <div className="graficos">
                {resImagen.length > 0 ? (
                  <Error resImagen={resImagen} />
                ) : (
                    <div></div>
                  )}
              </div>
            </tr>
            <div className="graficosTitulo">
              {resPost && (
                <h5>
                  {" "}
                  Diagnostico: <br></br>
                  {resPost.tags[0]}{" "}
                </h5>
              )}
            </div>
            <Link to={`/${patient.ws}/onlinedoctor/`}>
            <div className="">Si desea puede consultar a un médico online haciendo click aquí</div>
            </Link>
          </table>
        </div>
      }
    </>
  );
}


export default withRouter(LoadAnalysis)