const initialState = {
    first_predict: [],
    assignation_id: '',
    allBiomarkers: {},
    biomarker: [],
    current_biomarker: "",
    current_step:{
        active:'welcome'
    },
    to_predict:{
        answers:[]
    },
    qa_next: { pregunta:[],respuesta:[], key:'0' },
    qa_acumulado: { last:[] },
    final_predict:{
        respuesta:'',
        epicrisis:''

    }
  }

  export default function autonomous(state = initialState, action) {
    switch (action.type) {
        case 'AUTONOMOUS_ASSIGNATION_ID':
            return Object.assign({}, state, {
                assignation_id: action.payload
            })
        case 'AUTONOMOUS_SET_BIOMARKERS':
            return Object.assign({}, state, {
                biomarker: action.payload
            })
        case 'AUTONOMOUS_SET_ALL_BIOMARKERS':
            return Object.assign({}, state, {
                allBiomarkers: { ...state.allBiomarkers,...action.payload}
            })
        case 'AUTONOMOUS_SET_CURRENT_BIOMARKER':
            return Object.assign({}, state, {
                current_biomarker: action.payload
            })
        case 'AUTONOMOUS_SET_FIRST_PREDICT':
            return Object.assign({}, state, {
                first_predict: action.payload
              })
        case 'AUTONOMOUS_SET_FINAL_PREDICT':
            return Object.assign({}, state, {
                final_predict: action.payload
              })
        case 'AUTONOMOUS_SET_VALIDATION_LIST':
            return Object.assign({}, state, {
                to_predict: action.payload
            })
        case 'AUTONOMOUS_SET_QA_NEXT':
                return Object.assign({}, state, {
                    qa_next: action.payload
                })
        case 'AUTONOMOUS_SET_QA_ACUMULADO':
                return Object.assign({}, state, {
                    qa_acumulado: action.payload
                })
        case 'AUTONOMOUS_SET_STEP':
            return Object.assign({}, state, {
                current_step: action.payload
            })
        case 'AUTONOMOUS_RESET':
            return initialState;
        default:
            return state;
    }
  }