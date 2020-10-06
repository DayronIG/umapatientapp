
import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptopMedical, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import "../../styles/global/Backbutton.scss";

export default (props) => {
    return (
        <section className={props.inlineButton ? "backButtonContainer inlineButton" : "backButtonContainer"}> 
            <Link to={props.customTarget ? props.customTarget : '/'}>
                <FontAwesomeIcon className="mt-2 pt-1" icon={faArrowLeft} />
            </Link>
        </section>
    )
}
