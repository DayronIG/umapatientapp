const initialState = {
    audioData: null  
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case 'SET_AUDIO_ELEMENT':
        return { ...state, audioData: payload }
    default:
        return state
    }
}
