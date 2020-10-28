const initialState = {
    activeTracking: [],
    allTrackings: [],
    inactiveTracking: [],
    selectedTracking: 0
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "UMACARE_SET_TRACKINGS":
        return { ...state, ...action.payload }
      case "UMACARE_SET_ACTIVE":
        return { ...state, selectedTracking: action.payload}
      default:
        return state;
    }
  };
  