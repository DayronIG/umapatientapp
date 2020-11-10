import React from 'react'
import {Link} from 'react-router-dom';
import List from '../components/Appointments/Specialties/List';
import {GenericHeader, BackButton} from '../components/GeneralComponents/Headers';
import '../styles/appointments/Office.scss'

const Specialties = (props) => {
    return (
			<>
        <GenericHeader onClick={() => {props.history.go(`/${props.match.params.dni}/`)}}>Especialidades</GenericHeader>
        <BackButton />
        <div className="cal-fullheight">
            <List />
        </div>
        <Link to="./appointments/search-doctor">
          <div className="search-button">Buscar por médico</div>
        </Link>
        <div className="footer"></div>
			</>
    )
}

export default Specialties;