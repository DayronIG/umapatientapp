import React, {useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import Snackbar from '../../GeneralComponents/Snackbar/Snackbar';
import Sthetoscope from '../Biomarkers/Sthethoscope';
import DBConnection, {firebaseInitializeApp} from '../../../config/DBConnection';

const PatientActions = (props) => {
    const patient = useSelector(state => state.user)
    const biomarker = useSelector(state => state.front.biomarker.open)
    const dispatch = useDispatch()
    const call = useSelector(state => state.queries.callSettings)
    const fileInput = useRef(null)

    useEffect(() => {
        if(patient.biomarkers && patient.biomarkers.status >= 1) {
            dispatch({type: 'SET_BIOMARKER', payload: {open: true, status: patient.biomarkers.status}})
        }
    }, [patient.biomarkers])

    const handleClick = () => {
        console.log("attach", fileInput)
        fileInput.current.click()
    }

    const handleFileChange = event => {
        let file = event.target.files[0]
        let dt =  moment().tz("America/Argentina/Buenos_Aires").format('YYYYMMDDHHmmss')
        console.log("Uploading foto")
        let ref  = DBConnection.storage(firebaseInitializeApp).ref()
        let fileRef = ref.child(`${props.match.params.dni}/analysis/${dt}_adjunto`)
        fileRef.put(file).then(snap => { console.log("Uploaded ", snap, fileRef) })
    }

    return(
        <>
        {call && call.sala !== "" && 
        <div className="patientactions-container">
            {biomarker && patient.biomarkers && patient.biomarkers.status >= 1 && 
                <div className="patientactions-biomarker">
                    <div className="biomarker-container">
                        <Sthetoscope step={patient.biomarkers.status} />
                    </div>
                </div>
            }
            <div className="patientactions-calltoaction">
                <Snackbar alertType="success" titleMessage="" customMessage="" />
                <input
                    id="myFileUpload"
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    ref={fileInput} 
                />
                <div className="action-ico" onClick={() => handleClick()}><FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon></div>
            </div>
        </div>}
        </>
    )
}

export default withRouter(PatientActions);