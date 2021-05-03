const initialState = {
    corporate: '',
    dependant: '',
    description:'',
    dni: '',
    fullname: '',
    id: '',
    mercadoPago: false,
    price: '',
    product: '',
    quantity: 1,
    service: '',
    title: '',
    uid: '',
    doc_id: '',
}
    
export default function PaymentsReducer (state = initialState, { type, payload }) {
    switch (type) {
        case "SET_PAYMENT":
            return {...state, quantity: payload.quantity, product: payload.product, title: payload.title, id: payload.id, uid: payload.uid, service: payload.service, dependant: payload.dependant, price: payload.price, mercadoPago: payload.mercadoPago, description: payload.description, corporate: payload.corporate, dni: payload.dni, fullname: payload.fullname}
        case "RESET_PAYMENT":
            return {...state,dependant: '', description:'', id: '', mercadoPago: false, price: '', product: '', quantity: 1, service: '', title: '',uid: '', corporate: '' }
        case "SET_DOC_ID": 
            return { ...state, doc_id: payload }
        default:
            return state;
    }
};