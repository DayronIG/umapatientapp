const initialState = {
  core_id: "",
  country: null,
  email: "",
  dni: "",
  sex: "",
  dob: "",
  address: "",
  city: "",
  piso: "",
  depto: "",
  ws: "",
  day: "",
  month: "",
  year: "",
  dt: "",
  os: "",
  phone:"",
  osNumber: 0,
  fullname: "",
  userToFill: {
    dt_start: "",
    fullname: "",
    dni: "",
    ws: "",
    dob: "",
    sex: "",
    corporate: ""
  }
};

export default function userReducers(state = initialState, action) {
  switch (action.type) {
    case 'GET_PATIENT':
      return {...state, ...action.payload };
    case "USER_FIRST_CORE":
      return { ...state, core_id: action.payload };
    case "USER_FIRST_EMAIL":
      return { ...state, email: action.payload };
    case "USER_FIRST_DNI":
      return { ...state, dni: action.payload };
    case "USER_FIRST_SEX":
      return { ...state, sex: action.payload };
    case "USER_FIRST_DOB":
      return { ...state, dob: action.payload };
    case "USER_FIRST_ADDRESS":
      return { ...state, address: action.payload };
    case "USER_FIRST_CITY":
      return { ...state, city: action.payload };
    case "USER_FIRST_COUNTRY":
      return { ...state, country: action.payload };
    case "USER_FIRST_PISO":
      return { ...state, piso: action.payload };
    case "USER_FIRST_DEPTO":
        return { ...state, depto: action.payload };
    case "USER_FIRST_WS":
      return { ...state, ws: action.payload };
    case "USER_FIRST_DAY":
      return { ...state, day: action.payload };
    case "USER_FIRST_MONTH":
      return { ...state, month: action.payload };
    case "USER_FIRST_YEAR":
      return { ...state, year: action.payload };
    case "USER_FIRST_DT":
      return { ...state, dt: action.payload };
    case "USER_FIRST_OS":
      return { ...state, os: action.payload };
    case "USER_FIRST_OS_NUMBER":
      return { ...state, osNumber: action.payload };
    case "USER_FIRST_FULLNAME":
      return { ...state, fullname: action.payload };
    case "USER_PHONE_NUMBER":
        return { ...state, phone: action.payload };
    case "FILL_REGISTER":
      if (action.payload) {
        return { ...state, userToFill: action.payload };
      } else {
        return { ...state };
      }
    default:
      return state;
  }
}
