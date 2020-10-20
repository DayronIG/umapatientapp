const initialState = {
  appointment: '',
  answers: '',
  answersId: [],
  biomarkers: [],
  currentQuestion: { title: '', answers: [] },
  dominio: '',
  files: [],
  questionsToDo: [],
  nextAppointment: {},
  selectedSymptoms: [],
  selectedQuestions: [],
  selectedSymptomsString: '',
  selectedOtherSymptoms: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_DOMINIO':
      return {...state, dominio: action.payload}
    case 'SET_SYMPTOM':
      return {
        ...state,
        'selectedSymptoms': [...state.selectedSymptoms, action.payload]
      }
    case 'CLEAN_SYMPTOM':
      return {
        ...state,
        'selectedSymptoms': []
      }
    case 'REMOVE_SYMPTOM_TAG': 
      return {
        ...state,
        'selectedSymptoms': action.payload
      }
    case 'SET_SELECTED_QUESTIONS':
      return {
        ...state,
        'selectedQuestions': action.payload
      }
    case 'SET_QUESTIONS_TODO':
      return {
        ...state,
        'questionsToDo': action.payload
      }
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        'currentQuestion': action.payload
      }
    case 'SAVE_ANSWERS':
      return {
        ...state,
        'answers': state.answers.concat(action.payload)
      }
    case 'SAVE_FILES':
      return {
        ...state,
        'files': [...state.files, action.payload]
      }
    case 'SAVE_ANSWERS_ID':
      return {
        ...state,
        'answersId': action.payload
      }
    case 'SET_APPOINTMENT_STATUS':
      return {
        ...state, appointment: action.payload
      }
    case 'SET_ASSESSMENT_BIOMARKER':
      return {
        ...state,
        'biomarkers': [{...state.biomarkers[0], ...action.payload}]
      }
    case 'SET_NEXT_ATT':
      return {
        ...state, nextAppointment: action.payload
      }
    case 'SET_SELECTED_SYMPTOMS_STR':
      return { ...state, selectedSymptomsString: action.payload }
    case 'SET_OTHER_SYMPTOMS':
      return { ...state, selectedOtherSymptoms: action.payload }
    case 'ADD_TAG_ASSESSMENT':
      return { ...state, 'answers': state.answers.concat(action.payload) }
    case 'CLEAN_ASSESTMENT':
      return {
        initialState
      }
    default:
      return state
  }
}