import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { FaUserMd } from 'react-icons/fa';
import { MdExpandLess, MdMenu } from 'react-icons/md';
import moment from 'moment';

const TrackingSelector = () => {
    const [seguimiento, setSeguimiento] = useState(false);
    const umacare = useSelector(state => state.umacare)
    const iconProperties = {
        onClick: () => setSeguimiento(!seguimiento),
        'size':"1.5rem",
        'data-toggle': "collapse",
        'data-target':"#collapseExample",
        'aria-expanded':"false", 
        'aria-controls':"collapseExample"
      }

    return (
        <div className="trackingSelector__container">
            <div className="trackingSelector__title">
                <h4>Ver todos mis seguimientos</h4>
                {!seguimiento ? 
                <MdMenu {...iconProperties} /> :
                <MdExpandLess {...iconProperties} /> 
                }
            </div>
            <div className="collapse mt-2" id="collapseExample">
                <div className="trackingSelector__list">
                {umacare.allTrackings.map((el) => {
                    return (
                    <div className="event">
                        <FaUserMd size="1.2rem" />
                        <span>{el.mr_diagnostico}</span>
                        <strong>{moment(el.dt_cierre).format('DD/MM/YYYY')}</strong>
                    </div>)
                })}
                </div>
            </div>
        </div>
    )
}

export default TrackingSelector;