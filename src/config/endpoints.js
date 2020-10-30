const isLocal = window.location.origin.includes('localhost');
const URN_UMA = `https://uma-v2.uc.r.appspot.com`;
const NODE_DEV = `http://localhost:8080`; // https://20200924t180300-dot-nodeserver-dot-uma-v2.uc.r.appspot.com
const NODE_SERVER = isLocal ? NODE_DEV : `https://nodeserver-dot-uma-v2.appspot.com`;
const EVENTS = `https://gps-dot-uma-v2.appspot.com/v1/users`;
const POL = `https://pol-dot-uma-v2.appspot.com`;
const UP = `https://dxp.unionpersonal.com.ar`;
const up_token = 'sdHBFk3PUMtICR0Z-c1W';
const url_facePos = 'https://teachablemachine.withgoogle.com/models/-Eupnxuwx';
const computer_vision = 'https://computer-vision-dot-uma-v2.uc.r.appspot.com';
export const TRIAGE_UMA = 'https://triage-dot-uma-v2.appspot.com';

export const log_event = `${EVENTS}/events`;
export const user_online = `${URN_UMA}/user_online`;
export const afiliado = `${URN_UMA}/afiliado`;
export const make_appointment = `${URN_UMA}/make_appointment`;
export const feedback = `${URN_UMA}/feedback`;
export const get_labels = `${URN_UMA}/labels`;
export const user_cancel = `${URN_UMA}/user_cancel`;
export const assessment_url = `${URN_UMA}/assessment`;
export const triage = `${TRIAGE_UMA}/api_python`;
export const transport = `${URN_UMA}/user_traslados_app`;
export const transportFormCompleted = `${URN_UMA}/check_exist`;
export const install_event = `${URN_UMA}/events`;
export const sound_online = `${POL}/sound_online`;
export const pol_dni_front = `${POL}/pol_dni_front`;
export const pol_dni_back = `${POL}/pol_dni_back`;
export const pol_selfie = `${POL}/pol_selfie`;
export const start_biomarker = `${URN_UMA}/biomarkers`;
export const cobertura = `${URN_UMA}/cobertura`;
export const games = `${URN_UMA}/games`;
export const umacare_tracking = `${URN_UMA}/umacare`;
export const write_os = `${URN_UMA}/check_user`;
export const transcription = `${URN_UMA}/transcripcion`;
export const reassign_portal = `${URN_UMA}/reassign_portal`;
export const validate_up_dni = `${UP}/account_login_by_document?user_credentials=${up_token}`;
export const validate_up_dni_type2 = `${UP}/search/accounts_by?user_credentials=${up_token}`;
/* Node Server */
// Public
export const log_info = `${NODE_SERVER}/public/log_info`;
export const device_info = `${NODE_SERVER}/public/device_info`;
export const get_symptoms = `${NODE_SERVER}/public/get_symptoms`;
// Trees
export const flow_tree = `${NODE_SERVER}/tree/find`;
// UNION PERSONAL
export const post_up_ELG = `${NODE_SERVER}/unionpersonal/post_up_transactionELG`;
export const post_up_AP = `${NODE_SERVER}/unionpersonal/post_up_transactionAP`;
// cx
export const cx_action_create = `${NODE_SERVER}/cx/action_create`;
export const cx_user_response = `${NODE_SERVER}/cx/user_response`;
// Patients
export const send_user_code = `${NODE_SERVER}/patients/code`;
export const node_patient = `${NODE_SERVER}/patients`;
export const push_token = `${NODE_SERVER}/firebase/push_user_token`;
export const login_core = `${NODE_SERVER}/firebase/login_core`;
// Payments
export const payment_url = `${NODE_SERVER}/mercadopago/payment`;
export const payment_url_test = `${NODE_DEV}/mercadopago/payment`;
// Models
export const url_facePos_model = `${url_facePos}/model.json`;
export const url_facePos_metadata = `${url_facePos}/metadata.json`;
export const ocr_labo = `${computer_vision}/ocr_labo`;
// Providers 
export const get_provider = `${NODE_SERVER}/providers`;
// Transport
export const att_history = `${NODE_SERVER}/transportistas/v1/att_history`;
export const create_traslado = `${NODE_SERVER}/transportistas/v1/create_traslado`;
