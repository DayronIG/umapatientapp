import React from 'react';
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector} from 'react-redux';
import { faUserMd, faChevronRight, faFlask, faFileAlt } from '@fortawesome/free-solid-svg-icons';


const Events = (props) => {
    
    const {ws} = useSelector(state => state.user)

    const sectionEvents = [
        {
            sectionName: 'Recetas',
            icon: faFileAlt, 
            url: `/${ws}/recipes`
        },
        {
            sectionName: 'Órdenes y análisis',
            icon: faFlask,
            url: ``
        }, 
        {
            sectionName: 'Consultas',
            icon: faUserMd,
            url: `/${ws}/record`
        }
    ]

    return (
        <div className="event" >
                {
                    sectionEvents.map(item => {
                        return(
                            <>
                                <div className="event-section" onClick={e => props.history.push(item.url)}>
                                    <div className="section-icon">
                                        <FontAwesomeIcon icon={item.icon} />
                                        <span>{item.sectionName}</span>
                                    </div>
                                    <FontAwesomeIcon style={{color: "#719397"}} icon={faChevronRight}/> 
                                </div>
                                <div className='line'></div>
                            </>
                        )
                    })
                }
            </div>
    )
}

export default withRouter(Events);