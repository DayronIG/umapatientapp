export const labels = {
    studiesTypes: {
        ANTIGENO: 'Antígeno',
        PCR: 'PCR Express'
    },
    patientData:{
        patient: 'patient',
        dni: 'dni',
        fecha: 'fecha',
        nroProtocolo: 'nroProtocolo'
    }
}

export const texts = {
    'Antígeno': {
        description: {
            title: {
                es: 'PRUEBA RÁPIDA PARA LA DETECCIÓN DE ANTÍGENOS PARA COVID-19',
                en: 'RAPID TEST FOR DETECTION OF ANTIGENS FOR COVID-19'
            },
            method: {
                es: "Método: ",
                en: 'Method: '
            },
            task: {
                es: 'Se realiza la toma de muestra mediante hisopado nasofaríngeo.',
                en: 'Sample obtained using a nasopharyngeal swab.'
            }    
        },
        resultData: {
            result: {
                es: 'Resultado: ',
                en: 'Result: '
            },
            validation: {
                es: 'Resultados validados electrónicamente por: ',
                en: 'This protocol was validated and electronically signed by: '
            }
        }
    },
    'PCR Express':{
        description: {
            title: {
                es: 'PRUEBA DE DETECCIÓN DE GENOMA VIRAL 2019 nCOV',
                en: 'DETECTION TEST FOR VIRAL GENOME 2019 nCOV'
            },
            method: {
                es: "Método: ",
                en: 'Method: '
            },
            task: {
                es: 'Se realiza la toma de muestra mediante hisopado nasofaríngeo.',
                en: 'Sample obtained using a nasopharyngeal swab.'
            }    
        },
        resultData: {
            result: {
                es: 'Resultado: ',
                en: 'Result: '
            },
            validation: {
                es: 'Resultados validados electrónicamente por: ',
                en: 'This protocol was validated and electronically signed by: '
            }
        }
    }
}