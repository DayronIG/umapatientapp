/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import db, {firebaseInitializeApp} from '../../config/DBConnection';
import moment from 'moment-timezone';
import { CustomUmaLoader } from '../global/Spinner/Loaders';
// images
import preassigned from '../../assets/derivations/preassigned.png'
import assign from '../../assets/derivations/assign.png'
import done from '../../assets/derivations/done.png'
import cancel from '../../assets/derivations/cancel.png'
import noCall from '../../assets/derivations/noCall.png'
import imgDefault from '../../assets/derivations/imgDefault.png'
import FooterBtn from '../GeneralComponents/FooterBtn';
// Styles
import "../../styles/SoonContent.scss";
import "../../styles/Vmd/Derivations.scss";


const Preassign = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>Estamos Asignando un Servicio</h1>
          <div className='derivations'>
            <img className="preassigned" src={preassigned} alt="Derivación" />
          </div>
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}
const Assigned = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>Estamos en Camino</h1>
          <div className='derivations'>
            <img src={assign} alt="Derivación" />
          </div>
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}
const CallNotResponse = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>No pudimos Contactarnos</h1>
          <div className='derivations'>
            <img src={noCall} alt="Derivación" />
          </div>
          <Link to={'/appointmentsonline/who'} className="subtitleVmd">Solicitar una nueva consulta</Link> 
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}
const Cancel = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>El servicio fue Cancelado</h1>
          <div className='derivations'>
            <img src={cancel} alt="Derivación" />
          </div>
          <Link to={'/appointmentsonline/who'} className="subtitleVmd">Solicitar una nueva consulta</Link>
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}
const Done = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>El servicio fue Finalizado</h1>
          <div className='derivations'>
            <img src={done} alt="Derivación" />
          </div>
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}
const Default = ({history}) => {
  return (
    <div className="comingSoonContainer">
      <>
        <div className='soon-content'>
          <h1 className='titleVmd'>Actualmente sin derivaciones</h1>
          <div className='derivations'>
            <img src={imgDefault} alt="Derivación" />
          </div>
        </div>
        <FooterBtn
          mode="single"
          text="Volver"
          callback={() => history.push('/')}
        />
      </> 
    </div>
  )
}


const Derivations = ({history}) => {

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const DB = db.firestore(firebaseInitializeApp);

  const { dni } = useSelector(state => state.queries.patient);

  useEffect(() => {
    if(!dni) return;
    const subscription = DB.collection('/events/requests/online')
    .where('dni', '==', dni)
    .where('att_date', '>', moment().subtract(24, 'hours').format('YYYY-MM-DD hh:mm:ss'))
    .onSnapshot(snapshot => {
      let array = ['Evaluación en verde VMD', 'Evaluación en amarillo', 'Evaluación en rojo', 'Traslado protocolo pandemia'];
      snapshot.forEach(x => {
        let destinoFinal = x.data().destino_final;
        let res = array.some(data => data === destinoFinal);
        if(res) {
          setStatus(x.data().status)
        } else {
          setStatus('')
        }
      })
      setLoading(false)
    })
    return () => {
      subscription()
    }
  }, [dni])

  const stateValue = () => {
    switch (status) {
      case 'PREASSIGN': return <Preassign history={history} />;
      case 'ASSIGNED': return <Assigned history={history} />;
      case 'No contesta llamado': return <CallNotResponse history={history} />
      case 'CANCEL': return <Cancel history={history} />
      case 'DONE': return <Done history={history} />
      default: return <Default history={history} />
    }
  }

  return (
    <>{ loading ? <CustomUmaLoader /> : stateValue() }</>
  )
}

export default withRouter(Derivations);