import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faChevronRight, faCarAlt , faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { HistoryHeader } from '../GeneralComponents/Headers';
import { useSelector } from 'react-redux';
import './../../styles/history/MyHistory.scss';

const MyHistory = () => {
    const {ws} = useSelector(state => state.user)

    const sectionsHistory = [
        {
            sectionName: 'Recetas',
            icon: faFileAlt, 
            url: `/recipes/${ws}`
        },
        {
            sectionName: 'Consultas',
            icon: faUserMd,
            url: `/history/consultas/${ws}`
        }, 
        {
            sectionName: 'Autonomous',
            icon: faCarAlt,
            url: `''`
        }
    ]

    return (
        <> 
            <HistoryHeader> Mi historial </HistoryHeader>
            <div className="my-history-container">
                {
                    sectionsHistory.map((item, index) => {
                        return(
                            <>
                                <li key={index}>
                                    <Link to={item.url} className="link-to">
                                        <section className="section">
                                            <div className="section-name-icon">
                                                <div className="left-icon">
                                                    <FontAwesomeIcon icon={item.icon} />
                                                </div>
                                                <p>{item.sectionName}</p>
                                            </div>
                                            <FontAwesomeIcon className='foward-btn' icon={faChevronRight} />
                                        </section>
                                    </Link>
                                </li>
                                <hr/>
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}


export default MyHistory;
