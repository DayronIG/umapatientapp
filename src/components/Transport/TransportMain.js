
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import { transportFormCompleted } from '../../config/endpoints';
import Loading from '../GeneralComponents/Loading';
import '../../styles/generalcomponents/TransportMain.scss';

const TransportWrapperComponent = (props) => {
    const token = useSelector(state => state.userActive.token)
    const [activated, setActivated] = useState(null);
    const dispatch = useDispatch();
    const getUserData = localStorage.getItem('userData');
    const userDataToJson = JSON.parse(getUserData);

    useEffect(function() {
        dispatch({type: 'LOADING', payload: true})
        axios.post(transportFormCompleted, {
            'ws': userDataToJson.ws,
            'dni': userDataToJson.dni
        }, { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Authorization': token } })
        .then(function (response) {
            setActivated(response.data.output);
            dispatch({type: 'LOADING', payload: false})
        })
        .catch(function (error) {
            dispatch({type: 'LOADING', payload: false})
            console.log(error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(function() {
    //     if(activated === '1') {
    //         props.history.push(`/${props.match.params.ws}/transportRegister`) 
    //     } else if(activated === '') {
    //         props.history.push(`/${props.match.params.ws}/TransportRegister`) 
    //     }
    // }, [activated, props.history, props.match.params.ws])

    return (
        <>
            <div className="transportWrapper">
                <Loading/>
            </div>
        </>
    )
}

export default TransportWrapperComponent;
