const isLocal = window.location.origin.includes('localhost');
export const NODE_DEV = `http://localhost:8080`;
// default
const URN_UMA = isLocal ? `https://20210420t190621-dot-uma-v2.uc.r.appspot.com/v2` : `https://uma-v2.uc.r.appspot.com/v2` 
// node
export const NODE_SERVER = isLocal ? NODE_DEV : `https://nodeserver-dot-uma-v2.appspot.com`;
const POL = `https://pol-dot-uma-v2.appspot.com`;
const UP = `https://dxp.unionpersonal.com.ar`;
const up_token = 'sdHBFk3PUMtICR0Z-c1W';
const url_facePos = 'https://teachablemachine.withgoogle.com/models/-Eupnxuwx';
const computer_vision = 'https://computer-vision-dot-uma-v2.uc.r.appspot.com';
export const TRIAGE_UMA = 'https://triage-dot-uma-v2.appspot.com';
export const config = { headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('Notification_Token') || '' } }

export const user_online = `${URN_UMA}/user_online`;
export const make_appointment = `${URN_UMA}/make_appointment`;
export const feedback = `${URN_UMA}/feedback`;
export const get_labels = `${URN_UMA}/labels`;
export const user_cancel = `${URN_UMA}/user_cancel`;
export const triage = `${TRIAGE_UMA}/api_python`;
export const transport = `${URN_UMA}/user_traslados_app`;
export const install_event = `${URN_UMA}/events`;
export const sound_online = `${POL}/sound_online`;
export const start_biomarker = `${URN_UMA}/biomarkers`;
export const cobertura = `${URN_UMA}/cobertura`;
export const umacare_tracking = `${URN_UMA}/umacare`;
export const umacare = `${NODE_SERVER}/umacare`;
export const write_os = `${URN_UMA}/check_user`;
export const transcription = `${URN_UMA}/transcripcion`;
export const reassign_portal = `${URN_UMA}/reassign_portal`;
export const validate_up_dni = `${UP}/account_login_by_document?user_credentials=${up_token}`;
export const validate_up_dni_type2 = `${UP}/search/accounts_by?user_credentials=${up_token}`;
/* Node Server */
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
// Appointments
export const appointments_confirm = `${NODE_SERVER}/appointments/confirm`;
// Payments
export const payment_url = `${NODE_SERVER}/payments/mercadopago`;
export const mp_payment_url = `${NODE_SERVER}/payments/mercadopago/checkoutPro`
// Models
export const url_facePos_model = `${url_facePos}/model.json`;
export const url_facePos_metadata = `${url_facePos}/metadata.json`;
export const ocr_labo = `${computer_vision}/ocr_labo`;
// Providers 
export const get_provider = `${NODE_SERVER}/providers`;
// Transport
export const att_history = `${NODE_SERVER}/transportistas/v1/att_history`;
export const create_traslado = `${NODE_SERVER}/transportistas/v1/create_traslado`;
export const change_status_traslado = `${NODE_SERVER}/transportistas/v1/changeStatusTraslado`;
export const cancel_tramo = `${NODE_SERVER}/transportistas/v1/cancel_tramo`;
export const reclamo_tramo = `${NODE_SERVER}/transportistas/v1/reclamo_tramo`;
export const transport_register = `${NODE_SERVER}/transportistas/v1/user_traslados_app`;
export const check_exist = `${NODE_SERVER}/transportistas/v1/check_exist`;
export const transport_feedback = `${NODE_SERVER}/transportistas/v1/feedback`;
export const transportFormCompleted = `${URN_UMA}/check_exist`;
// Feedback
export const user_feedback = `${NODE_SERVER}/feedback`;
// Delivery
export const create_delivery = `${NODE_SERVER}/delivery`
export const mobility_address = `${NODE_SERVER}/delivery/mobility_address`;
// Invitations
export const invitation = `${NODE_SERVER}/invitation`;
// Biomarkers
export const post_biomarkers = `${NODE_SERVER}/events/biomarkers`;
// Vaccine
export const vaccine = `${NODE_SERVER}/vaccine`;
// Vaccine
export const analysis = `${NODE_SERVER}/analysis`;