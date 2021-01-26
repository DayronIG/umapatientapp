import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HistoryHeader } from '../GeneralComponents/Headers';
import HeaderContainer from './HeaderContainer/HeaderContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import ValidateAction from '../ValidateAction/index';
import { Link } from 'react-router-dom'
import '../.././styles/history/RecipeSection.scss';

const RecipeSection = () => {

    const [tab, setTab] = useState('todas')
    const [lastMr, setLastMr] = useState([{created_dt: ''}])
    const mr = useSelector(state => state.queries.medicalRecord)
    const patient = useSelector(state => state.user)
    const [drugName, setDrugName] = useState(false)

    
console.log(patient)

    useEffect(() => {
        setLastMr(mr.filter(el=> {
            return el.mr.destino_final !== "" 
            && el.mr.destino_final !== "Paciente Ausente"
            && el.mr.destino_final !== "Anula por falla de conexión"
            && el.mr.destino_final !== "USER CANCEL"
            && el.mr.destino_final !== "Anula el paciente"
        }).slice(0, 5))
   }, [mr])

   useEffect(() => {
        setDrugName(true)
   }, [lastMr])

   console.log('last mr', lastMr)
   
   function getCards(recetasArray) {
    let divsPush = []
    recetasArray.forEach(element => {
        divsPush.push (
            <Link className="history-recipe" to={`/${patient.ws}/history/${patient.dni}/`}> 
                {/* assignation_id en lastMr como ultimo parametro */}

                <div className="leftIcon">
                    <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <div className="info-recipe">
                    <p className="product-name">{element.productName}</p>
                    <p className="p-date">{element.prescriptionDate}</p>
                </div>
            </Link>
        )
    });
    return divsPush
   }

    return(
        <>
        <HistoryHeader> Recetas </HistoryHeader>
        <HeaderContainer> 
            <ValidateAction action='not-clickable' field='recipe'>
                <button className={tab === 'todas' ? 'active button-record' : 'button-record'} onClick={() => setTab('todas')}>
                    Todas
                </button>
            </ValidateAction>
            <ValidateAction action='not-clickable' field='recipe'>
                <button className={tab === 'pendientes' ? 'active button-record' : 'button-record'} onClick={() => setTab('pendientes')}>
                    Pendientes
                </button>
            </ValidateAction>
            <ValidateAction action='not-clickable' field='recipe'>
                <button className={tab === 'usadas' ? 'active button-record' : 'button-record'} onClick={() => setTab('usadas')}>
                    Usadas
                </button>
            </ValidateAction>
        </HeaderContainer>
        <div className='recipe-container'> 
            {
                drugName ?
                    lastMr.length >= 0  ? 
                    lastMr.map(r => getCards(r.mr.receta))
                    :
                    <div>No encontro la data</div>
                :
                <div>No se han encontrado recetas</div>

                // lastMr ? 
                //     lastMr.map(r => getCards(r.mr.receta))
                //     :
                //     <div>No encontro la data</div>
            }
        </div>
        </>
    )
}

export default RecipeSection;