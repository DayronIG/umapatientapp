import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { HistoryHeader } from '../GeneralComponents/Headers'
import HeaderContainer from './HeaderContainer/HeaderContainer'
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import ValidateAction from '../ValidateAction/index'

const RecipeSection = () => {
    const [tab, setTab] = useState('todas')

    //DossierContainer o nuevo componente?
    //ValidateAction field recipe

    return(
        <>

        <HistoryHeader> Recetas </HistoryHeader>
        <HeaderContainer>
            <button className={tab === 'todas' ? 'active button-record' : 'button-record'} onClick={() => setTab('todas')}>Todas</button>
            <button className={tab === 'pendientes' ? 'active button-record' : 'button-record'} onClick={() => setTab('pendientes')}>Pendientes</button>
            <button className={tab === 'usadas' ? 'active button-record' : 'button-record'} onClick={() => setTab('usadas')}>Usadas</button>
        </HeaderContainer>
        <div className='dossier-container'> 
            {/* cambiar contenido segun tab */}
        </div>
        </>
    )

}

export default RecipeSection;