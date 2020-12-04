import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAuth } from '../store/actions/firebaseQueries';
import { getDocumentFB, snapDocumentsByFilter } from '../components/Utils/firebaseUtils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import * as DetectRTC from 'detectrtc';
import "../styles/welcome.scss";

const Welcome = props => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [install, setInstall] = React.useState(true)
  const user = useSelector(state => state.user)
  useEffect(() => {
    DetectRTC.load(function () {
      if (DetectRTC.osName === "iOS") {
        setInstall(false)
      }
    });
  }, []);

  async function installAction(install) {
    try {
      if(install) {
        await props.showInstallPrompt()
      }
      let userAuth = await getAuth(user.ws)
      const plan = await getCoverage(user.ws)
      const params = await getDocumentFB('parametros/userapp/delivery/hisopados')
      await getDeliveryInfo(user.ws)
      dispatch({ type: 'GET_PATIENT', payload: userAuth })
      dispatch({ type: 'SET_DELIVERY_PARAMS', payload: params })
      dispatch({ type: 'SET_PLAN_DATA', payload: plan })
      history.push('/home')
    } catch (err) {
      console.error(err)
    }
  }

  	
	const getCoverage = async (user) => {
		// Busco BASIC primero porque es el básico sin ningun permiso
		let plan = await getDocumentFB('services/porfolio/BASIC/active')
		let free = await getDocumentFB('services/porfolio/FREE/active')
		if(plan && free) {
			plan["onlinedoctor"] = free.onlinedoctor
		}
		if (!!user?.coverage && Array.isArray(user?.coverage) && plan) { 
			// Este else if es el mas importante. 
			// Un usuario puede tener multiples subscriptions
			// El usuario tiene como servicios el resultado de la sumatoria de ellos (de los true)
			user && user.coverage && user.coverage.forEach(async each => {
				if(each?.plan) {
					let path = `services/porfolio/${each?.plan?.toUpperCase()}/active`
					let coverageTemp = await getDocumentFB(path)
					for (const service in coverageTemp) {
						if(coverageTemp[service] === true) {
							plan.plan[service] = true
						}
					}
				}
			})
		}
		return plan
	}

  async function getDeliveryInfo(userAuth) {
		const params = await getDocumentFB('parametros/userapp/delivery/hisopados')
		dispatch({type: 'SET_DELIVERY_PARAMS', payload: params})
		if(userAuth.dni) {
			let filters =  [{field: 'status', value: ["PREASSIGN", "DEPENDANT", "FREE:IN_RANGE", "ASSIGN:DELIVERY", "ASSIGN:ARRIVED", "DONE:RESULT"], comparator: 'in'}, {field: 'patient.uid', value: userAuth.core_id, comparator: '=='}]
			await snapDocumentsByFilter('events/requests/delivery', filters, (data) => {
				dispatch({type: 'CLEAN_DELIVERY', payload: "CLEAN"})
				dispatch({type: 'SET_DELIVERY_ALL', payload: data})})
		}
    }


  return (
    <div className="welcome-container">
    <section className="welcome">
      <div className="welcome__iconContainer">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <div className="welcome__titleContainer">
        <h2 className="welcome__titleContainer--title">Bienvenido a UMA</h2>
      </div>
      <div className="welcome__textContainer">
        <span className="welcome__textContainer--message">
          Haga click en
          <span onClick={() => props.showInstallPrompt()} className="link">
            {" "}
            instalar
          </span>{" "}
          y luego "Agregar UMA a la pantalla principal" para instalar la aplicación.
        </span>
        {install ?
          <div className="btn btn-blue-lg" onClick={() => installAction()}>Instalar</div>
          :
          <div className="btn btn-blue-lg" onClick={() => installAction(false)}>Continuar</div>
        }
      </div>
    </section>
    </div>
  );
};

export default Welcome;