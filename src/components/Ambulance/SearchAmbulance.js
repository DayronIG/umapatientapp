import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericHeader } from "../GeneralComponents/Headers";
import AmbulanceMap from "./AmbulanceMap";
import AmbulanceDistance from "./AmbulanceDistance";
import AmbulanceComponent from "./AmbulanceComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Geocode from "react-geocode";
import Backbutton from '../GeneralComponents/Backbutton';
import FooterBtn from '../GeneralComponents/FooterBtn';
import "../../styles/Ambulance.scss";

const SearchAmbulance = () => {
  const [location, setLocation] = useState();
  const [address, setAdress] = useState({ lat: -34.6037, lng: -58.3816 });
  const [addresFormated, setAddresFormated] = useState("")
  const [hasSearch, setHasSearch] = useState(false);
  const haveDuration = useSelector(
    state => state.queries.ambulanceHaveDuration
  );
  const getDuration = useSelector(state => state.queries.ambulanceTime);
  const [direccion, setDireccion] = useState(false);
  const [distance, setDistance] = useState(false);
  const [duration, setDuration] = useState(false);
  const [distanciaFinal, setDistanciaFinal] = useState(0);

  const mapURL =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs&v=3.exp&libraries=geometry,drawing,places";
  const dispatch = useDispatch();
  const [puntoMasCercano, setPuntoMasCercano] = useState("");
  const [puntoDeInicio, SetPuntoDeInicio] = useState({
    lat: "",
    lng: ""
  });

  useEffect(() => {
    if (hasSearch) {
      setTimeout(() => {
        if (puntoMasCercano.split(",")[0] !== "") {
          var start = new window.google.maps.LatLng(
            puntoDeInicio.lat,
            puntoDeInicio.lng
          );
          var end = new window.google.maps.LatLng(
            puntoMasCercano.split(",")[0].slice(1, -1),
            puntoMasCercano.split(",")[1].slice(0, -1)
          );
        }
        const DS = new window.google.maps.DirectionsService();
        DS.route(
          {
            origin: start,
            destination: end,
            travelMode: "DRIVING"
          },
          (res, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDireccion(res);
              setDistance(res.routes["0"].legs["0"].distance.text)
              setDuration(res.routes["0"].legs["0"].duration.text)
              dispatch({
                type: "SET_AMBULANCE_DURATION",
                payload: res.routes["0"].legs["0"].duration.text
              })
              // console.log("Distancia", res.routes["0"].legs["0"].distance.text)
              // console.log("Duración", res.routes[0].legs[0].duration.text)
            } else {
              setDireccion(res)
              setDistance("9999km")
              setDuration("23h 59 min")
              dispatch({ type: "SET_AMBULANCE_DURATION", payload: "999999" });
            }
            dispatch({ type: "SET_AMBULANCE_HAVEDURATION", payload: true });
          }
        );
      }, 500);
    }
  }, [hasSearch, puntoMasCercano]);

  useEffect(() => {
    SetPuntoDeInicio({ lat: address.lat, lng: address.lng });
    //console.log("EFFECT:", puntoDeInicio);
  }, [address]);

  useEffect(() => {
    setTimeout(() => {
      let ubicacion_uno = new window.google.maps.LatLng(
        puntoDeInicio.lat,
        puntoDeInicio.lng
      );

      let ubicacion_dos = new window.google.maps.LatLng({
        lat: -34.557739,
        lng: -58.416998
      });

      let ubicacion_tres = new window.google.maps.LatLng({
        lat: -34.607646,
        lng: -58.41244
      });

      let ubicacion_cuatro = new window.google.maps.LatLng({
        lat: -34.623226,
        lng: -58.360892
      });

      let ubicacion_cinco = new window.google.maps.LatLng({
        lat: -34.544415,
        lng: -58.459645
      });

      let ubicacion_seis = new window.google.maps.LatLng({
        lat: -34.814934,
        lng: -58.534796
      });

      let ubicacion_siete = new window.google.maps.LatLng({
        lat: -34.577026,
        lng: -58.53894
      });

      let ubicacion_ocho = new window.google.maps.LatLng({
        lat: -34.6059529,
        lng: -58.4433488
      });

      let ubicacion_nueve = new window.google.maps.LatLng({
        lat: -34.6099084,
        lng: -58.5657768
      });

      let ubicacion_diez = new window.google.maps.LatLng({
        lat: -34.6537204,
        lng: -58.6452386
      });

      let ubicacion_once = new window.google.maps.LatLng({
        lat: -34.6317583,
        lng: -58.4308142
      });

      let ubicacion_doce = new window.google.maps.LatLng({
        lat: -34.5100914,
        lng: -58.5305353
      });

      let ubicacion_trece = new window.google.maps.LatLng({
        lat: -34.5631905,
        lng: -58.4758866
      });

      let ubicacion_catorce = new window.google.maps.LatLng({
        lat: -34.5721882,
        lng: -58.4544952
      });

      let ubicacion_quince = new window.google.maps.LatLng({
        lat: -34.627852,
        lng: -58.4067085
      });

      let ubicacion_dieciseis = new window.google.maps.LatLng({
        lat: -34.6222311,
        lng: -58.3884935
      });

      let ubicacion_diecisiete = new window.google.maps.LatLng({
        lat: -34.6558719,
        lng: -58.4997894
      });

      let ubicacion_dieciocho = new window.google.maps.LatLng({
        lat: -34.5836088,
        lng: -58.4068906
      });

      let ubicacion_diecinueve = new window.google.maps.LatLng({
        lat: -34.7327776,
        lng: -58.2969098
      });

      let ubicacion_veinte = new window.google.maps.LatLng({
        lat: -34.7517,
        lng: -58.588461
      });

      let ubicacion_veintiuno = new window.google.maps.LatLng({
        lat: -34.6939045,
        lng: -58.3926775
      });

      let ubicacion_veintidos = new window.google.maps.LatLng({
        lat: -34.754984,
        lng: -58.3985626
      });

      let ubicacion_veintitres = new window.google.maps.LatLng({
        lat: -34.8176698,
        lng: -58.4706932
      });

      let ubicacion_veinticuatro = new window.google.maps.LatLng({
        lat: -34.644799,
        lng: -58.795831
      });

      let ubicacion_veinticinco = new window.google.maps.LatLng({
        lat: -34.6669496,
        lng: -58.6038917
      });

      let ubicacion_veintiseis = new window.google.maps.LatLng({
        lat: -34.5021375,
        lng: -58.4971357
      });

      let ubicacion_veintisiete = new window.google.maps.LatLng({
        lat: -34.4712874,
        lng: -58.6566699
      });

      let ubicacion_veintiocho = new window.google.maps.LatLng({
        lat: -34.4553699,
        lng: -58.5436952
      });

      let ubicacion_veintinueve = new window.google.maps.LatLng({
        lat: -34.6809343,
        lng: -58.3473557
      });

      let ubicacion_treinta = new window.google.maps.LatLng({
        lat: -34.6479103,
        lng: -58.5660234
      });

      let ubicacion_treintayuno = new window.google.maps.LatLng({
        lat: -34.5350667,
        lng: -58.7242736
      });

      let punto_mas_cercano = ubicacion_dos;
      let distancia_mas_cercana = 999999;

      /*
       * BLOQUE 1
       */
      let distancia_entre_uno_y_dos = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_dos
      );

      // 352.04093462042187  metros
      if (distancia_entre_uno_y_dos < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_dos;
        punto_mas_cercano = ubicacion_dos;
      }

      /*
       * BLOQUE 2
       */

      let distancia_entre_uno_y_tres = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_tres
      );
      // 314.68024839262654 metros
      if (distancia_entre_uno_y_tres < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_tres;
        punto_mas_cercano = ubicacion_tres;
      }

      /*
       * BLOQUE 3
       */

      let distancia_entre_uno_y_cuatro = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_cuatro
      );

      if (distancia_entre_uno_y_cuatro < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_cuatro;
        punto_mas_cercano = ubicacion_cuatro;
      }

      let distancia_entre_uno_y_cinco = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_cinco
      );

      if (distancia_entre_uno_y_cinco < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_cinco;
        punto_mas_cercano = ubicacion_cinco;
      }

      let distancia_entre_uno_y_seis = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_seis
      );

      if (distancia_entre_uno_y_seis < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_seis;
        punto_mas_cercano = ubicacion_seis;
      }

      let distancia_entre_uno_y_siete = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_siete
      );

      if (distancia_entre_uno_y_siete < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_siete;
        punto_mas_cercano = ubicacion_siete;
      }

      let distancia_entre_uno_y_ocho = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_ocho
      );

      if (distancia_entre_uno_y_ocho < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_ocho;
        punto_mas_cercano = ubicacion_ocho;
      }

      let distancia_entre_uno_y_nueve = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_nueve
      );

      if (distancia_entre_uno_y_nueve < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_nueve;
        punto_mas_cercano = ubicacion_nueve;
      }

      let distancia_entre_uno_y_diez = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_diez
      );

      if (distancia_entre_uno_y_diez < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_diez;
        punto_mas_cercano = ubicacion_diez;
      }

      let distancia_entre_uno_y_once = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_once
      );

      if (distancia_entre_uno_y_once < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_once;
        punto_mas_cercano = ubicacion_once;
      }

      let distancia_entre_uno_y_doce = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_doce
      );

      if (distancia_entre_uno_y_doce < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_doce;
        punto_mas_cercano = ubicacion_doce;
      }

      let distancia_entre_uno_y_trece = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_trece
      );

      if (distancia_entre_uno_y_trece < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_trece;
        punto_mas_cercano = ubicacion_trece;
      }

      let distancia_entre_uno_y_catorce = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_catorce
      );

      if (distancia_entre_uno_y_catorce < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_catorce;
        punto_mas_cercano = ubicacion_catorce;
      }

      let distancia_entre_uno_y_quince = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_quince
      );

      if (distancia_entre_uno_y_quince < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_quince;
        punto_mas_cercano = ubicacion_quince;
      }

      let distancia_entre_uno_y_dieciseis = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_dieciseis
      );

      if (distancia_entre_uno_y_dieciseis < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_dieciseis;
        punto_mas_cercano = ubicacion_dieciseis;
      }

      let distancia_entre_uno_y_diecisiete = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_diecisiete
      );

      if (distancia_entre_uno_y_diecisiete < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_diecisiete;
        punto_mas_cercano = ubicacion_diecisiete;
      }

      let distancia_entre_uno_y_dieciocho = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_dieciocho
      );

      if (distancia_entre_uno_y_dieciocho < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_dieciocho;
        punto_mas_cercano = ubicacion_dieciocho;
      }

      let distancia_entre_uno_y_diecinueve = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_diecinueve
      );

      if (distancia_entre_uno_y_diecinueve < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_diecinueve;
        punto_mas_cercano = ubicacion_diecinueve;
      }

      let distancia_entre_uno_y_veinte = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veinte
      );

      if (distancia_entre_uno_y_veinte < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veinte;
        punto_mas_cercano = ubicacion_veinte;
      }

      let distancia_entre_uno_y_veintiuno = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintiuno
      );

      if (distancia_entre_uno_y_veintiuno < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintiuno;
        punto_mas_cercano = ubicacion_veintiuno;
      }

      let distancia_entre_uno_y_veintidos = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintidos
      );

      if (distancia_entre_uno_y_veintidos < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintidos;
        punto_mas_cercano = ubicacion_veintidos;
      }

      let distancia_entre_uno_y_veintitres = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintitres
      );

      if (distancia_entre_uno_y_veintitres < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintitres;
        punto_mas_cercano = ubicacion_veintitres;
      }

      let distancia_entre_uno_y_veinticuatro = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veinticuatro
      );

      if (distancia_entre_uno_y_veinticuatro < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veinticuatro;
        punto_mas_cercano = ubicacion_veinticuatro;
      }

      let distancia_entre_uno_y_veinticinco = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veinticinco
      );

      if (distancia_entre_uno_y_veinticinco < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veinticinco;
        punto_mas_cercano = ubicacion_veinticinco;
      }

      let distancia_entre_uno_y_veintiseis = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintiseis
      );

      if (distancia_entre_uno_y_veintiseis < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintiseis;
        punto_mas_cercano = ubicacion_veintiseis;
      }

      let distancia_entre_uno_y_veintisiete = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintisiete
      );

      if (distancia_entre_uno_y_veintisiete < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintisiete;
        punto_mas_cercano = ubicacion_veintisiete;
      }

      let distancia_entre_uno_y_veintiocho = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintiocho
      );

      if (distancia_entre_uno_y_veintiocho < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintiocho;
        punto_mas_cercano = ubicacion_veintiocho;
      }

      let distancia_entre_uno_y_veintinueve = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_veintinueve
      );

      if (distancia_entre_uno_y_veintinueve < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_veintinueve;
        punto_mas_cercano = ubicacion_veintinueve;
      }

      let distancia_entre_uno_y_treinta = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_treinta
      );

      if (distancia_entre_uno_y_treinta < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_treinta;
        punto_mas_cercano = ubicacion_treinta;
      }

      let distancia_entre_uno_y_treintayuno = window.google.maps.geometry.spherical.computeDistanceBetween(
        ubicacion_uno,
        ubicacion_treintayuno
      );

      if (distancia_entre_uno_y_treintayuno < distancia_mas_cercana) {
        distancia_mas_cercana = distancia_entre_uno_y_treintayuno;
        punto_mas_cercano = ubicacion_treintayuno;
      }
      // console.log(ubicacion_uno, punto_mas_cercano.toString());

      setPuntoMasCercano(punto_mas_cercano.toString());
    }, 1000);
  }, [puntoDeInicio]);



  const calculo = (location, hasSearch) => {
    setHasSearch(hasSearch);
    Geocode.setApiKey("AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs");
    dispatch({ type: "SET_AMBULANCE_HAVEDURATION", payload: false })
    Geocode.setLanguage("es");
    Geocode.setRegion("ar");
    Geocode.enableDebug();
    if (location !== "") {
      Geocode.fromAddress(location).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          // console.log(response.results[0].geometry);
          setAdress({ lat, lng });
          setAddresFormated(response.results[0].formatted_address)
        },
        error => {
          console.error(error);
        }
      );
    }
  };

  return (
    <>
      <GenericHeader style={{ width: "80%", alignContent: "center" }} children='Ambulancia' />
      <Backbutton />
      <div className='ambulance-container'>
        {haveDuration ?
          <AmbulanceComponent tiempo={getDuration} coords={{ lat: address.lat, lng: address.lng }} address={location} addressFormated={addresFormated} />
          :
          <>
            <div className="searchAmbulance-container">
              <div className="search-container">
                <div className="search-title">
                  <b>Compruebe si tenemos cobertura en su zona</b>
                </div>
                <div className="search-input">
                  <input className="search-input" type="text" placeholder="Dirección" onChange={e => setLocation(e.target.value)} />
                  <div className="tag-delicon d-flex" onClick={() => calculo(location, false)}>
                    <span className="mr-2">Comprobar</span>
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
              </div>
              <div className="search-map">
                <AmbulanceMap
                  className="search-map"
                  googleMapURL={mapURL}
                  containerElement={
                    <div style={{ height: "30vh", width: "100%" }} />
                  }
                  mapElement={<div style={{ height: "100%" }} />}
                  loadingElement={<p>Cargando...</p>}
                  coords={address}
                />
              </div>
            </div>
            <FooterBtn
              mode="single"
              text="siguiente"
              callback={() => calculo(location, true)}
            />
          </>
        }
      </div>
    </>
  );
};

export default SearchAmbulance;
