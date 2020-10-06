const initialState = {
  buffer: { first: '', second: '', third: '', fourth: '' },
  attempts: 0,
  showInstructions: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "POL_SET_BUFFER_FIRST":
      return Object.assign({}, state, { buffer: { ...state.buffer, first: action.payload } })
    case "POL_SET_BUFFER_SECOND":
      return Object.assign({}, state, { buffer: { ...state.buffer, second: action.payload } })
    case "POL_SET_BUFFER_THIRD":
      return Object.assign({}, state, { buffer: { ...state.buffer, third: action.payload } })
    case "POL_SET_BUFFER_FOURTH":
      return Object.assign({}, state, { buffer: { ...state.buffer, fourth: action.payload } })
    case "POL_SHOW_INSTRUCTIONS":
      return Object.assign({}, state, { showInstructions: action.payload })
    case "POL_ATTEMPTS_COUNT":
      return Object.assign({}, state, { attempts: action.payload })
    default:
      return state;
  }
};
