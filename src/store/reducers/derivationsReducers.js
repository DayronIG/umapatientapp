const initialState = {
    derivation: {
        derivationActive: '',
        derivationStatus: ''
    },
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "USER_DERIVATIONS":
            return {...state, derivation: action.payload};
        default:
            return state;
    }
};
