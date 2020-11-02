const initialState = {
    answerQuestions: false,
    action: '',
    alert: {
        active: false,
        type: 'success',
        title: '',
        msg: ''
    },
    biomarker: { open: true, status: 0 },
    checkStatus: false,
    currentQuestion: 0,
    dinamic: { whenDinamic: false, queueDinamic: true },
    error: '',
    hisopadosActive: false,
    loading: false,
    mic_cam_permissions: '',
    modal: false,
    modalAction: false,
    nextQuestion: '',
    openDetails: false,
    otherReason: false,
    paginationTransport: 1,
    remainingText: '',
    showAskText: true,
    sidebar: { first: false, second: false },
    versions: {patients: '0.0.0'},
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
        case 'HANDLE_MODAL':
                return { ...state, modal: action.payload, action: action.action };
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
        case 'SET_HISOPADOS_ACTIVE':
            return { ...state, hisopadosActive: action.payload };
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
        case 'SET_VERSIONS':
            return { ...state, versions: action.payload }
        default:
            return state;
    }
}
