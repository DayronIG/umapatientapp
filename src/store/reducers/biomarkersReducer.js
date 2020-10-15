const initialState = {
    audioData: null,
    sthetoscopeID: ""  
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case 'SET_AUDIO_ELEMENT':
        return { ...state, audioData: payload }
    case "SET_STHETOSCOPE_ID":
        return { ...state, sthetoscopeID: payload }
    default:
        return state
    }
}
