import React from 'react';
import { faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/derivations/derivations.scss';

const ButtonHome = ({ text }) => {
    const history = useHistory();
    const uid = useSelector(state => state.user.core_id)

    return (
            <button className='button__derivation' onClick={()=> history.push(`/derivations/${uid}`)}>
                <div className='button__derivation--group'>
                <FontAwesomeIcon icon={faClock} />
                    <p>{text}</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
    )
}

export default ButtonHome;