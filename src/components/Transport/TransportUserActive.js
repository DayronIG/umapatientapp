
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DisplayTrips from './DisplayTrips';

import '../../styles/generalcomponents/TransportUserActive.scss';

const TransportUserActive = (props) => {

    const cancelTripComments = useSelector((state) => state.userActive.cancelTripComments);

    return (
        <div className="wrapperUserActive">
            <div className="transportUserActive">
                <DisplayTrips />
            </div>
        </div>
    )
}

export default TransportUserActive;
