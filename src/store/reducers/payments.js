const initialState = {
    corporate: '',
    dependant: '',
    description:'',
    id: '',
    mercadoPago: false,
    price: '',
    product: '',
    quantity: 1,
    service: '',
    title: '',
    uid: '',
}
    
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case "SET_PAYMENT":
            return {...state, quantity: payload.quantity, product: payload.product, title: payload.title, id: payload.id, uid: payload.uid, service: payload.service, dependant: payload.dependant, price: payload.price, mercadoPago: payload.mercadoPago, description: payload.description, corporate: payload.corporate}
        case "RESET_PAYMENT":
            return {...state,dependant: '', description:'', id: '', mercadoPago: false, price: '', product: '', quantity: 1, service: '', title: '',uid: '', corporate: '' }
        default:
            return state;
    }
};