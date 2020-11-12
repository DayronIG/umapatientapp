const initialState = {
  coreId: "",
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

export default function frontReducers(state = initialState, action) {
  switch (action.type) {
    case "REGISTER_FIRST_CORE":
      return { ...state, coreId: action.payload };
    case "REGISTER_FIRST_EMAIL":
      return { ...state, email: action.payload };
    case "REGISTER_FIRST_DNI":
      return { ...state, dni: action.payload };
    case "REGISTER_FIRST_SEX":
      return { ...state, sex: action.payload };
    case "REGISTER_FIRST_DOB":
      return { ...state, dob: action.payload };
    case "REGISTER_FIRST_ADDRESS":
      return { ...state, address: action.payload };
    case "REGISTER_FIRST_CITY":
      return { ...state, city: action.payload };
    case "REGISTER_FIRST_COUNTRY":
      return { ...state, country: action.payload };
    case "REGISTER_FIRST_PISO":
      return { ...state, piso: action.payload };
    case "REGISTER_FIRST_DEPTO":
        return { ...state, depto: action.payload };
    case "REGISTER_FIRST_WS":
      return { ...state, ws: action.payload };
    case "REGISTER_FIRST_DAY":
      return { ...state, day: action.payload };
    case "REGISTER_FIRST_MONTH":
      return { ...state, month: action.payload };
    case "REGISTER_FIRST_YEAR":
      return { ...state, year: action.payload };
    case "REGISTER_FIRST_DT":
      return { ...state, dt: action.payload };
    case "REGISTER_FIRST_OS":
      return { ...state, os: action.payload };
    case "REGISTER_FIRST_OS_NUMBER":
      return { ...state, osNumber: action.payload };
    case "REGISTER_FIRST_FULLNAME":
      return { ...state, fullname: action.payload };
    case "REGISTER_PHONE_NUMBER":
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
