import React, { useEffect, useState }  from "react";
import '../styles/Whatsapp.scss';
import * as DetectRTC from 'detectrtc';
import axios from 'axios';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import Switch from 'react-switch';
import { Link } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';

const InformationPage = ({
	  button = 'ENVIAR INVITACIÓN',
    imgProps = {
    styles: {},
    img: ''
  }
}) => {
    const [install, setInstall] = React.useState(true);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [successSending, setSuccessSending] = useState(false);

    useEffect(() => {
      //console.log(DetectRTC.isWebsiteHasWebcamPermissions())
      DetectRTC.load(function () {
        // console.log(DetectRTC.osName)
        if (DetectRTC.osName === "iOS") {
          setInstall(false)
        }
      });
    }, []);

    const sendPhoneCall = (inputPhone) => {
        let ws = inputPhone.replace("+", "").replace("(", "").replace(")", "").replace(/\s/g, "")
        if(ws.slice(0,2) === "54") ws = "549"+ws.slice(2)
        setLoading(true);
        let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
/*         let d = {user: 'uma', password: 'umaonline2020'}
            axios.post(`http://localhost:8080/auth`, d, {headers})
                .then(res => console.log(res))
                .catch(err => console.log(err))
                setLoading(false); */
        const url = "https://mr-dot-uma-v2.appspot.com"
        const dataHsm = {
            "ws": ws,
            "hsm_name": "request",
            "enterprise_username": "patient",
            "hsm_params": [" con el registro"],
            "ttl": 1,
            "optional_message": "Mi nombre es Uma y estoy para ayudarle. Para acceder a la plataforma escriba *hola*",
            "lang":"es_AR"
        }
        axios.post(url + "/send_hsm", dataHsm, { "Content-type": "application/json" })
            .then(res => {
                setLoading(false);
                setSuccessSending(true)
            })
            .catch(err => {
                setLoading(false);
                setSuccessSending('error');
            })
    }

  return (
    <div className="information__container">
      <section className="whatsapp" >
        {imgProps.img && 
          <div className='imgContainer'>
            <img src={imgProps.img} style={imgProps.styles} className='imgContainer__image' /> 
          </div>
        }
        <div className="titleContainer">
          <h2 className="titleContainer__title mt-5">¡Escribe <span className='hola'>HOLA</span> a nuestro Whatsapp y listo!</h2>
        </div>
        <div className="textContainer">          
            <p className='textContainer__message' >
            Uma es nuestra plataforma de consultas online, para que puedas acceder a todos tus médicos sin moverte de tu casa.
            </p>          
          <br />
          <div className='phoneinputandbutton__container'>
            <div className='phoneinput__cointainer'>
              <br/>
              <PhoneInput
                  className='phoneinput' 
                  placeholder={''}
                  country='ar'
                  value={phone}
                  onChange={ (value) => setPhone(value) } 
              />
          </div>
          <button className="button__instalar" disabled={!isChecked}
              style={{minWidth: '200px'}}
              onClick={() => sendPhoneCall(phone)}>{button}</button>
          </div>
        <div className='terminos__container'>
            <div className="landingSwitchContainer">
                <Switch type="checkbox" 
                    id="medicalVisit" 
                    checked={isChecked} 
                    name="medicalVisit" 
                    onChange={() => setIsChecked(!isChecked)} />
            </div>
            <span className="termsText">
                Acepto los términos y condiciones y la política de privacidad
            </span>
        </div>
        </div>
        {/* <AddToHomescreen onAddToHomescreenClick={() => handleAddToHomescreenClick()} title="Instalar UMA" icon={logo} /> */}
      </section>
    </div>
  );
};

export default InformationPage;
