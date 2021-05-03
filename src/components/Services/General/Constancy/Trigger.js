import moment from "moment"
import { useRef } from "react"
import { FaDownload } from "react-icons/fa"
import ReactToPrint from "react-to-print"
import Constancy from "./constancia"
import UMAlogo from '../../../../assets/logo.png'
import EMERlogo from '../../../../assets/logo-emergencias.png'
import './hide.scss'

const ConstancyTrigger = ({rowData, CustomButton = null}) => {
    const ref = useRef()
    const {patient, id, lab, service, dt_cierre} = rowData

    const patientData = [
        {label: 'Paciente', value: patient?.fullname},
        {label: 'DNI', value: patient?.dni},
        {label: 'Fecha', value: moment(dt_cierre ? dt_cierre.toDate() : new Date()).format("DD/MM/YYYY")},
    ]
    const patientDataEn = [
        {label: 'Patient', value: patient?.fullname},
        {label: 'DNI', value: patient?.dni},
        {label: 'Date', value: moment(dt_cierre ? dt_cierre.toDate() : new Date()).format("DD/MM/YYYY")},
    ]    

    const resultsHelper = {
        POSITIVE: 'POSITIVO',
        NEGATIVE: 'NEGATIVO'
    }

    const methodHelper = {
        es: {
            'Antígeno': 'Inmuno-cronomatográco (PANIBO™ COVID-19 AG RAPID TEST DEVICE)',
            'PCR Express': 'IRT - PCR'
        },
        en : {
            'Antígeno': 'Immune-chronatographic (PANIBO™ COVID-19 AG RAPID TEST DEVICE)',
            'PCR Express': 'IRT - PCR'
        }
    }

    const langHelper = {
        'PCR Express': ['es', 'en'],
        'Antígeno': ['es']
    }

    return (
        <>
            <ReactToPrint 
                trigger={() => CustomButton || <FaDownload className='buttonDownload'/>}
                content={() => ref.current}
            />
            <div className="pdfWrapper">
                <div ref={ref}>
                    <Constancy
                        id={rowData.id}
                        result={{
                            es: resultsHelper[lab?.result_lab],
                            en: lab?.result_lab
                        }}
                        patientData={{
                            es: patientData,
                            en: patientDataEn
                        }}
                        logo={[UMAlogo, EMERlogo]}
                        lang={langHelper[service]}
                        studieType={service}
                        method = {{
                            es: methodHelper.es[service],
                            en: methodHelper.en[service]
                        }}
                        validator= 'Dr. Fernando Luis Raffo M. N. 6.925'
                    />
                </div>
            </div>
        </>
    )
}

export default ConstancyTrigger;