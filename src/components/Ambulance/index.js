import React from 'react';
import {useSelector} from 'react-redux';
import SearchAmbulance from './SearchAmbulance.js';
import AmbulanceService from './AmbulanceService.js';
import Loading from '../GeneralComponents/Loading';

const VMD = () => {
    const plan = useSelector((state) => state.queries.plan)
    const loading = useSelector(state => state.front.loading)

    return (
        <>
        {loading && <Loading />}
        {plan.userapp && plan.userapp["1"] === "1" ?
            <AmbulanceService />
        :
            <SearchAmbulance />
        }
        </>
    )
}

export default VMD