import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { HistoryHeader } from '../GeneralComponents/Headers';
import HeaderContainer from './HeaderContainer/HeaderContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { getPrescriptions } from '../../store/actions/firebaseQueries';
import ValidateAction from '../ValidateAction/index';
import '../.././styles/history/RecipeSection.scss';

const RecipeSection = () => {
    const dispatch = useDispatch()
    const [tab, setTab] = useState('todas')
    const patient = useSelector(state => state.user)
    const prescriptions = useSelector(state => state.queries.prescriptions)

    useEffect(() => {
        if(patient.core_id) {
            dispatch(getPrescriptions(patient.core_id))
        }
    }, [patient])

    const getCards = (itemsArray) => {
        let divsPush = []
        itemsArray.forEach(el => {
            divsPush.push(
                <div className="info-recipe">
                    <p className="product-name">{el.productName}</p>
                    <p className="p-date">{el.prescriptionDate}</p>
                </div>
            )
        })
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
                    prescriptions && prescriptions.map(p => {
                        return(
                            <Link className="history-recipe" to={`/${patient.ws}/history/${p.hc}/receta`}> 
                                <div className="leftIcon">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </div>
                                {
                                    getCards(p.items)
                                }
                            </Link>
                        )
                    })
                }
            </div>
        </>
    )
}

export default RecipeSection;