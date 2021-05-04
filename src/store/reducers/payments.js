const initialState = {
    abbottId: '',
    corporate: '',
    dependant: '',
    description:'',
    dni: '',
    doc_id: '',
    fullname: '',
    mercadoPago: false,
    price: '',
    product: '',
    quantity: 1,
    service: '',
    title: '',
    uid: ''
}
    
export default function PaymentsReducer (state = initialState, { type, payload }) {
    switch (type) {
        case "SET_PAYMENT":
            return {...state, quantity: payload.quantity, product: payload.product, title: payload.title, abbottId: payload.abbottId, uid: payload.uid, service: payload.service, dependant: payload.dependant, price: payload.price, mercadoPago: payload.mercadoPago, description: payload.description, corporate: payload.corporate, dni: payload.dni, fullname: payload.fullname}
        case "RESET_PAYMENT":
            return {...state,dependant: '', description:'', abbottId: '', mercadoPago: false, price: '', product: '', quantity: 1, service: '', title: '',uid: '', corporate: '', dni: '', fullname: '' }
        case "SET_DOC_ID": 
            return { ...state, doc_id: payload }
        default:
            return state;
    }
};