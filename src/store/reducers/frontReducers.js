const initialState = {
    active_guardia: true,
    active_list: true,
    alert: {
        active: false,
        type: 'success',
        title: '',
        msg: ''
    },
    biomarker: { open: true, status: 0 },
    error: '',
    guardia_advice: false,
    loading: false,
    checkStatus: false,
    dinamic: { whenDinamic: false, queueDinamic: true },
    modal: false,
    otherReason: false,
    answerQuestions: false,
    paginationTransport: 1,
    showAskText: true,
    nextQuestion: '',
    currentQuestion: 0,
    openDetails: false,
    modalAction: false,
    mic_cam_permissions: '',
    remainingText: '',
    sidebar: { first: false, second: false },
    vmdStage: 'who',
}

export default function frontReducers(state = initialState, action) {
    switch (action.type) {
        case 'LOADING':
            return { ...state, loading: action.payload };
        case 'ALERT':
            return {
                ...state,
                alert: {
                    active: !state.alert.active,
                    type: action.payload.type,
                    title: action.payload.title,
                    msg: action.payload.msg
                }
            };
        case 'SET_BIOMARKER_WINDOW':
            return {
                ...state, biomarker: { open: action.payload }
            }
        case 'SET_BIOMARKER':
            return {
                ...state, biomarker: action.payload
            }
        case 'ERROR':
            return { ...state, error: action.payload };
        case 'OPEN_MODAL':
            return { ...state, modal: true, action: action.action };
        case 'CLOSE_MODAL':
            return { ...state, modal: false, action: action.action };
        case 'ON_HOVER':
            return { ...state, hover: action.payload };
        case 'OPEN_WHEN_DINAMIC':
            return {
                ...state,
                dinamic: { whenDinamic: !state.dinamic.whenDinamic, queueDinamic: true }
            };
        case 'OTHER_REASON':
            return { ...state, otherReason: true };
        case 'CLOSE_QUEUE_DINAMIC':
            return {
                ...state,
                dinamic: { queueDinamic: !state.dinamic.queueDinamic }
            };
        case 'NEXT_QUESTION':
            return { ...state, nextQuestion: action.payload };
        case 'CURRENT_QUESTION':
            return { ...state, currentQuestion: ++state.currentQuestion };
        case 'OPEN_QUESTIONS':
            return { ...state, answerQuestions: action.payload };
        case 'SET_PAGINATION_TRANSPORT':
            return { ...state, paginationTransport: action.payload };
        case 'SHOW_ASK_TEXT':
            return { ...state, showAskText: action.payload };
        case 'TOGGLE_DETAIL':
            return { ...state, openDetails: !state.openDetails };
        case 'TOGGLE_MODAL_ACTION':
            return { ...state, modalAction: action.payload };
        case 'EDIT_SECTION':
            return { ...state, section: action.payload };
        case 'SIDEBAR_SEC_CLOSE':
            return Object.assign({}, state, {
                sidebar: { second: action.payload }
            });
        case 'SIDEBAR_SEC_OPEN':
            return Object.assign({}, state, {
                sidebar: { second: action.payload, first: false }
            });
        case 'SIDEBAR_FIRST_CLOSE':
            return Object.assign({}, state, {
                sidebar: { first: action.payload }
            });
        case 'SIDEBAR_FIRST_OPEN':
            return Object.assign({}, state, {
                sidebar: { first: action.payload, second: false }
            });
        case 'SET_APPOINT_ACTION':
            return { ...state, actionHandler: action.payload };
        case 'SET_STATUS':
            return { ...state, checkStatus: action.payload };
        case 'CLEAN_FRONT':
            return {
                ...state,
                sidebar: { first: false, second: false },
                actionHandler: ''
            };
        case 'REMAINING_ATT_TIME':
            return { ...state, remainingText: action.payload }
        case 'SET_VMD_STAGE':
            return { ...state, vmdStage: action.payload };
        case 'SET_CAM_MIC_PERMISSIONS':
            return { ...state, mic_cam_permissions: action.payload };
        case 'SET_GUARDIA_VARIABLES':
            return {...state, ...action.payload}
        case 'SET_GUARDIA_STATS':
            return {...state, ...action.payload}
        case 'SET_ORIGIN_TRANSLATE_MONDAY':
            return { ...state, origin_translate_monday: action.payload };
        case 'SET_ORIGIN_TRANSLATE_TUESDAY':
            return { ...state, origin_translate_tuesday: action.payload };
        case 'SET_ORIGIN_TRANSLATE_WEDNESDAY':
            return { ...state, origin_translate_wednesday: action.payload };
        case 'SET_ORIGIN_TRANSLATE_THURSDAY':
            return { ...state, origin_translate_thursday: action.payload };
        case 'SET_ORIGIN_TRANSLATE_FRIDAY':
            return { ...state, origin_translate_friday: action.payload };
        case 'SET_BACK_TRANSLATE_MONDAY':
                return { ...state, back_translate_monday: action.payload };
        case 'SET_BACK_TRANSLATE_TUESDAY':
            return { ...state, back_translate_tuesday: action.payload };
        case 'SET_BACK_TRANSLATE_WEDNESDAY':
            return { ...state, back_translate_wednesday: action.payload };
        case 'SET_BACK_TRANSLATE_THURSDAY':
            return { ...state, back_translate_thursday: action.payload };
        case 'SET_BACK_TRANSLATE_FRIDAY':
            return { ...state, back_translate_friday: action.payload };
        default:
            return state;
    }
}