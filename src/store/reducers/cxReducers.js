const initialState = {
    cx: '',
  }

  export default function callReducers(state = initialState, action) {
    switch (action.type) {
        case 'SET_CX_RESPONSE':
            return { ...state, cx: action.payload }
        default:
            return state;
    }
  }