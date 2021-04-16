const initialState = {
    quantity: 1,
    product: '',
    id: '',
    uid: '',
    service: '',
    dependant: '',
    price: ''
}
    
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case "SET_PAYMENT":
            return {...state, quantity: payload.quantity, product: payload.product, title: payload.title, id: payload.id, uid: payload.uid, service: payload.service, dependant: payload.dependant, price: payload.price}
        default:
            return state;
    }
};