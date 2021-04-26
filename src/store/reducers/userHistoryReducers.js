const initialState = {
    active: false,
    alcohol: "",
    alcoholFrequency: "",
    allergy: "",
    allergyType: [],
    celiac: "",
    completed: false,
    diabetes: "",
    diabetesType: "",
    edit: false,
    fractures: "",
    fracturesType: [],
    familyCancer: "",
    familyCancerDetails: [],
    familyDiabetes: "",
    familyDiabetesDetails: [],
    familyHypertension: "",
    familyHypertensionDetails: [],
    familyOtherDisease: "",
    hypertension: "",
    hypertensionType: "",
    operations: "",
    operationsType: [],
    otherTraumatism: "",
    otherTraumatismType: "",
    smoke: "",
    thyroid: "",
    thyroidType: "",
  };
  
  export default function userHistory(state = initialState, action) {
    switch (action.type) {
        case 'GET_HISTORY':
            return {...state, ...action.payload };
        case 'HISTORY_COMPLETED':
            return {...state, completed: true};
        case 'RESET_USER_HISTORY':
            return initialState;
        case 'USER_HISTORY_ACTIVE':
            return {...state, active: action.payload};
        case 'USER_HISTORY_ALCOHOL':
            return {...state, alcohol: action.payload };
        case 'USER_HISTORY_ALCOHOL_FREQUENCY':
            return {...state, alcoholFrequency: action.payload };
        case 'USER_HISTORY_ALLERGY':
            return {...state, allergy: action.payload };
        case 'USER_HISTORY_ALLERGY_TYPE':
            return {...state, allergyType: action.payload};
        case 'USER_HISTORY_CELIAC':
            return {...state, celiac: action.payload};
        case 'USER_HISTORY_DIABETES':
            return {...state, diabetes: action.payload};  
        case 'USER_HISTORY_DIABETES_TYPE':
            return {...state, diabetesType: action.payload};
        case 'USER_HISTORY_EDIT': 
            return {...state, edit: action.payload};
        case 'USER_HISTORY_FRACTURE':
            return {...state, fractures: action.payload };
        case 'USER_HISTORY_FRACTURES_TYPES':
            return {...state, fracturesType: action.payload};
        case'USER_HISTORY_FAMILY_CANCER':
            return {...state, familyCancer: action.payload};
        case 'USER_HISTORY_FAMILY_CANCER_DETAILS':
            return {...state, familyCancerDetails: action.payload};
        case'USER_HISTORY_FAMILY_DIABETES':
            return {...state, familyDiabetes: action.payload};
        case 'USER_HISTORY_FAMILY_DIABETES_DETAILS':
            return {...state, familyDiabetesDetails: action.payload};
        case'USER_HISTORY_FAMILY_HYPERTENSION':
            return {...state, familyHypertension: action.payload};
        case 'USER_HISTORY_FAMILY_HYPERTENSION_DETAILS':
            return {...state, familyHypertensionDetails: action.payload};
        case 'USER_HISTORY_FAMILY_OTHER_DISEASE':
            return {...state, familyOtherDisease: action.payload};
        case 'USER_HISTORY_HYPERTENSION':
            return {...state, hypertension: action.payload};
        case 'USER_HISTORY_HYPERTENSION_TYPE':
            return {...state, hypertensionType: action.payload};
        case 'USER_HISTORY_OPERATIONS':
            return {...state, operations: action.payload };
        case 'USER_HISTORY_OPERATIONS_TYPES':
            return {...state, operationsType: action.payload};
        case 'USER_HISTORY_OTHER_TRAUMATISM':
            return {...state, otherTraumatism: action.payload};
        case 'USER_HISTORY_OTHER_TRAUMATISM_TYPE':
            return {...state, otherTraumatismType: action.payload};
        case 'USER_HISTORY_SMOKE':
            return {...state, smoke: action.payload };
        case'USER_HISTORY_THYROID':
            return {...state, thyroid: action.payload};
        case'USER_HISTORY_THYROID_TYPE':
            return {...state, thyroidType: action.payload};
      default:
        return state;
    }
  }
  