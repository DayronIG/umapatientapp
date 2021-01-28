const initialState = {
    ambulanceTime: '',
    ambulanceHaveDuration: false,
    appointments: [],
    attempts: 1,
    beneficiaries: [],
    bills: [],
    callSettings: { room: '', token: '' },
    country: "",
    dniFront: '',
    dniBack: '',
    feedback: [],
    geolocation: { lat: '', lng: '' },
    medicalRecord: [],
    prescriptions: [],
    patient: { ws: '', },
    plan: {
        onlinedoctor: {
            ambulance: '0',
            autonomous: '0',
            constancy: '0',
            home_care: '0',
            lab_orders: '0',
            my_specialist: '0',
            onlinedoctor: '0',
            pol: '0',
            recipe: '0',
            translation: '0',
            umacare: '0',
            vmd: '0',
            wellness: '0'
        }
    },
    questions: [],
    selfie: '',
    symptoms: [],
    voucher: [],
    upNumAff_store: '',
    assignedAppointment: {},
    userUmacareStatus: '',
    umaCareStartDate: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_QUESTIONS':
            return Object.assign({}, state, {
                questions: action.payload
            });
        case 'GET_SYMPTOMS':
            return Object.assign({}, state, {
                symptoms: action.payload
            });
        case 'GET_APPOINTMENTS':
            return Object.assign({}, state, {
                appointments: action.payload
            });
        case 'GET_BENEFICIARIES':
            return Object.assign({}, state, {
                beneficiaries: action.payload
            });
        case 'GET_MEDICAL_RECORD':
            return Object.assign({}, state, {
                medicalRecord: action.payload
            });
        case 'GET_ONE_RECORD':
            return Object.assign({}, state, {
                voucher: action.payload
            });
        case 'SET_PLAN_DATA':
            return Object.assign({}, state, {
                plan: action.payload
            })
        case 'SET_USER_COUNTRY':
            return Object.assign({}, state, {
                country: action.payload
            })
        case 'GET_BILLS':
            return Object.assign({}, state, {
                bills: action.payload
            })
        case 'SET_FEEDBACK':
            return Object.assign({}, state, {
                feedback: action.payload
            });
        case 'SET_GEOLOCATION':
            return {
                ...state,
                geolocation: action.payload
            };
        case 'SET_CALL_ROOM':
            return Object.assign({}, state, {
                callSettings: action.payload
            });
        case 'SET_AMBULANCE_HAVEDURATION':
            return { ...state, ambulanceHaveDuration: action.payload };
        case 'SET_AMBULANCE_DURATION':
            return { ...state, ambulanceTime: action.payload };
        case 'SET_UP_NUMAFF':
            return { ...state, upNumAff_store: action.payload };
        case 'SET_ASSIGNED_APPOINTMENT':
            return { ...state, assignedAppointment: action.payload }
        case 'SET_PRESCRIPTIONS':
            return { ...state, prescriptions: action.payload}
        case 'SET_UMACARE':
            return { ...state, umacare: action.payload }
        case 'SET_UMACARE_STATUS':
            return { ...state, userUmacareStatus: action.payload }
        case 'SET_UMACARE_STARTDT':
            return { ...state, umaCareStartDate: action.payload }
        default:
            return state;
    }
};
