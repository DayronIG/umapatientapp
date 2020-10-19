import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import SymptomsTracking from '../components/SymptomsTracking/SymptomsForm';
import { SymptomsEnd, SymptomsOk, SymptomsWarning } from '../components/SymptomsTracking/SymptomsStatus';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import { umacare_tracking } from '../config/endpoints';
import Loading from '../components/GeneralComponents/Loading';
import { getDocumentFB } from '../components/Utils/firebaseUtils';
import swal from 'sweetalert';
import '../styles/symptomstracking/symptomstracking.scss';

const SymptomsTrackingView = (props) => {
    const { userUmacareStatus } = useSelector(state => state.queries)
    const biomarkers = useSelector(state => state.assessment.biomarkers)
    const [paramsData] = useState(props.match.params.data)
    const [component, setComponent] = useState('loading')
    const token = useSelector(state => state.userActive.token)

    const dispatch = useDispatch()

    const sendTracking = async (data, biomarker) => {
        if(!data.fever || !data.faces) {
            swal({
                text: "Por favor complete todo el cuestionario",
                icon: "warning",
            });
            return;
        }
        setComponent('loading')
        const sendData = {
            ...data,
            path: paramsData,
            orden: props.match.params.key,
            status: userUmacareStatus,
            biomarker: biomarker[0] ? biomarker[0].video : ''
        }
        try {
            const { data: response } = await Axios.post(umacare_tracking, sendData, { headers: { 'Content-Type': 'application/json', 'Authorization': token  } })
            if (response.output === 'si') {
                return setComponent('ok')
            } else if (response.output === 'no') {
                return setComponent('warning')
            } else {
                return setComponent('end')
            }
        } catch (error) {
            // console.log(error)
            swal('Aviso', 'Hubo un error al enviar los datos.', 'warning')
            return props.history.replace('/')
        }
    }

    useEffect(() => {
        window.onbeforeunload = () => true
        return () => window.onbeforeunload = null
    }, [])

    useEffect(() => {
        (async function getUmacareStatus() {
            setComponent('loading')
            const data = await getDocumentFB(`/events/labs/umacare/${paramsData}`)
            dispatch({ type: 'SET_UMACARE', payload: data })
            dispatch({ type: 'SET_UMACARE_STATUS', payload: data ? data.status : '' })
            dispatch({ type: 'SET_UMACARE_STARTDT', payload: data ? data.dt_cierre : '' })
            setComponent(null)
        })()
    }, [])

    const router = () => {
        switch (component) {
            case 'loading':
                return <Loading centered={true} />
            case 'ok':
                return <SymptomsOk history={props.history} />
            case 'warning':
                return <SymptomsWarning history={props.history} />
            case 'end':
                return <SymptomsEnd history={props.history} />
            default:
                return <SymptomsTracking ws={props.match.params.ws} sendTracking={(e) => sendTracking(e, biomarkers)} />
        }
    }

    return (
        <>
            <GenericHeader children='Control diario' logo='umacare' />
            {router()}
        </>
    )
}


export default withRouter(SymptomsTrackingView);