import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Geocode from "react-geocode";
import axios from 'axios';
import { cobertura } from '../../config/endpoints';
import Loading from '../GeneralComponents/Loading';
import VmdCard from '../../assets/checkout/vmd.png';
import vmd from '../../assets/icons/vmd.png';
import Alert from '../GeneralComponents/Alert/Alerts';
import FooterBtn from '../GeneralComponents/FooterBtn';
import "../../styles/Vmd/Vmd.scss";

const SearchVMDService = (props) => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.userActive.token)
  const front = useSelector(state => state.front)
  const patient = useSelector(state => state.queries.patient)
  const [location, setLocation] = useState()
  const [address, setAdress] = useState({ lat: -34.6037, lng: -58.3816 })
  const [addressFormated, setAddresFormated] = useState("")
  const [hasSearch, setHasSearch] = useState(false)
  const [coverage, setCoverage] = useState({ zone_category: '', zone_name: '', description: '', valid: '' })
  const mapURL =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs&v=3.exp&libraries=geometry,drawing,places";
  const [alert, setAlert] = React.useState({ display: true, type: '', title: '', customMessage: '' })
  const [puntoDeInicio, SetPuntoDeInicio] = useState({
    lat: "",
    lng: ""
  });


  useEffect(() => {
    // Prevent stuck on previous loading
    dispatch({ type: 'LOADING', payload: false })
  }, [])

  useEffect(() => {
    SetPuntoDeInicio({ lat: address.lat, lng: address.lng });
    console.log(address)
  }, [address]);

  const calculo = location => {
    dispatch({ type: 'LOADING', payload: true })
    setHasSearch(true);
    Geocode.setApiKey("AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs");
    // dispatch({ type: "SET_AMBULANCE_HAVEDURATION", payload: false })
    Geocode.setLanguage("es");
    Geocode.setRegion("ar");
    Geocode.enableDebug();
    if (location !== "") {
      Geocode.fromAddress(location).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          // console.log(response.results[0].geometry);
          setAdress({ lat, lng });
          let data = {
            "lat": lat,
            "lon": lng
          }
          setAddresFormated(response.results[0].formatted_address)
          let headers = { 'Content-Type': 'application/json'/* , 'Authorization': token */ }
          let url = "https://mr-dot-uma-v2.appspot.com/coverage_area"
          axios.post(url, data, headers)
            .then((res) => {
              let description = {}
              if (res.data.zone_category === "Zona cubierta") {
                description = { description: "¡Contamos con cobertura en su zona!", valid: 1 }
              } else if (res.data.zone_category === "Zona roja") {
                description = { description: "Contamos con cobertura limitada en su zona.", valid: 1 }
              } else {
                description = { description: "No disponemos cobertura en esa zona.", valid: 0 }
              }
              setCoverage({ ...description, ...res.data })
              console.log(res)
              dispatch({ type: 'LOADING', payload: false })
            })
            .catch(err => {
              console.log(err)
              dispatch({ type: 'LOADING', payload: false })
            })
        },
        error => {
          console.error(error);
        });
    }
  };

  const warnUser = () => {
    dispatch({ type: 'LOADING', payload: true })
    let data = {
      'ws': `${patient.ws}`,
      'dni': `${patient.dni}`,
      'address': `${location}`,
      'formatted_address': `${addressFormated}`, // formatted address retordeb by google API
      'dob': `${patient.dob}`,
      'sex': `${patient.sex}`,
      'fullname': `${patient.fullname}`,
      'lat': `${address.lat}`,
      'lon': `${address.lng}`,
      'service': 'AMB'
    }
    let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': token  */}
    axios.post(cobertura, data, headers)
      .then(res => {
        dispatch({ type: 'LOADING', payload: false })
        setAlert({ display: true, type: 'success', title: 'Aviso registrado!', customMessage: 'Te notificaremos cuando haya cobertura en tu zona' })
      })
      .catch(err => {
        dispatch({ type: 'LOADING', payload: false })
        setAlert({ display: true, type: 'danger', title: 'No pudimos registrar su pedido', customMessage: 'Ocurrió un error inesperado. Intentelo más tarde.' })
      })
  }

  const hideModal = () => {
    setAlert({ display: false })
  }

  return (
    <>
      {front.loading ?
        <Loading />
        :
        <>
          {alert.display && <Alert alertType={alert.type} titleMessage={alert.title} customMessage={alert.customMessage} customAction={() => hideModal()} />}
          <div className='vmd-container'>
            <div className="searchVmd-container">
              <div className="search-container">
                <div className="search-title">
                  <b>Compruebe si tenemos cobertura en su zona. Indique su dirección y localidad.</b>
                </div>
                <div className="search-input">
                  <form onSubmit={() => calculo(location)}>
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Dirección"
                      onChange={e => setLocation(e.target.value)}
                    />
                  </form>
                  <FontAwesomeIcon icon={faSearch} className="tag-delicon" />
                </div>
              </div>
              <div className="coverage-container">
                <p className="coverage-title">{coverage.zone_category}</p>
                <p className="coverage-description">{coverage.description}</p>
                {coverage.valid !== 0 &&
                  <div className="vmd-img-container">
                    <img src={coverage.valid === 1 ? VmdCard : vmd} className={coverage.valid !== 1 && 'vmd-img'} alt="Visita médica domiciliaria" />
                  </div>
                }
              </div>
            </div>
            {coverage.valid === 1 &&
              <button className="checkout-button" onClick={() => props.history.push('/checkout/vmd')}>
                <b>Contratar Servicio</b>
              </button>
            }
            {coverage.valid === 0 &&
              <button className="checkout-button" onClick={() => warnUser()}>
                <b>Avisarme cuando haya servicio</b>
              </button>
            }
            <FooterBtn
              text="comprobar"
              mode="single"
              callback={() => calculo(location)}
            />
          </div>
        </>
      }
    </>
  );
};

export default withRouter(SearchVMDService);
