import React from 'react';
import { Route, Switch } from 'react-router-dom';
/* History */
import History from './views/History.js';
import MyRecords from './components/MyRecords/MyRecords';
import MyHistory from './components/MyRecords/MyHistory';
import RecipeSection from './components/MyRecords/RecipeSection';
/* User */
import PrivateRoute from './PrivateRoute';
import Welcome from './views/Welcome';
import Reset from './views/Reset';
import Feedback from './views/Feedback';
import Login from './components/User/Login';
import LoginWithCore from './components/User/LoginWithCore';
import Home from './views/Home';
import RegisterNew from './views/RegisterNew';
import Register from './views/Register';
import Status from './components/User/SignUp/Status';

import LoginPhoneNumber from './components/User/Login/LoginPhoneNumber/LoginPhoneNumber';
import ForgottenAccError from './components/User/Login/ForgottenPass/ForgottenAccError';
import ConfirmationCode from './components/User/SignUp/ConfirmationCode';
import WelcomeAgain from './components/User/Login/LoginPhoneNumber/WelcomeAgain';
import SignUp from './components/User/SignUp/SignUp';
import SignUpForm from './components/User/SignUp/Register';

/* Profile */
import Profile from './views/Profile';
/* Online Doctor */
import Who from './components/OnlineDoctor/WhoScreen/WhoScreen';
import When from './components/OnlineDoctor/WhenScreen/WhenAtt';
import Reason from './components/OnlineDoctor/Reason/';
import Rating from './components/OnlineDoctor/Rating/Rating';
import AttQueue from './components/OnlineDoctor/AttQueue';
import CallContainer from './components/OnlineDoctor/StartCall/';
import ComingSoon from './components/GeneralComponents/ComingSoon';
import NotFound from './components/GeneralComponents/NotFound';
// Survey and Transport 
import Survey from './components/Transport/Survey';
import TransportMain from './components/Transport/TransportMain';
import TransportRegister from './components/Transport/TransportRegister';
import TransportUserActive from './components/Transport/TransportUserActive';
import CreateTransportRouteView from './views/CreateTransportRouteView';
import ScheduleTransportView from './views/ScheduleTransportView';
import TransportDetailsView from './views/TransportDetailsView';
import TransportNoDriver from './components/Transport/TransportNoDriver';
import ScheduledTransportSuccess from './components/Transport/ScheduledTransportSuccess.jsx';
// Appointments Online
import OnlineSpecialist from './components/AppointmentsOnline/';
import ListSpecialties from './components/AppointmentsOnline/ListSpecialties';
import SearchDoctorOnline from './components/AppointmentsOnline/SearchDoctor';
import SelectSymptoms from './components/AppointmentsOnline/SelectSymptoms';
import CalendarOnline from './components/AppointmentsOnline/Calendar';
import AppointmentsOnlineHistory from './components/AppointmentsOnline/AppointmentsOnlineHistory';
import Questions from './components/OnlineDoctor/Questions/';
/* Autonomous */
import Autonomous from './components/Autonomous/';
/* Laboratorio */
import Laboratorio from './components/Laboratorio';
/* Wellness */
import Wellness from './views/Wellness';
/* DeliveryService */
import DeliveryTrackProgress from './components/DeliveryService/DeliveryTrackProgress.js';
/* SymptomsTracking */
import SymptomsTracking from './views/SymptomsTrackingView';
import UmaCare from './components/UmaCare/index.js';
/* Autonomous */
import DeliveryPurchase from "./components/DeliveryService/DeliveryPurchase"
import DeliveryCoverage from './components/DeliveryService/DeliveryCoverage'
import DeliveryResults from "./components/DeliveryService/DeliveryResults";
import DeliveryListTracker from "./components/DeliveryService/DeliveryListTracker/DeliveryListTracker";
import HisopadoCart from './components/DeliveryService/HisopadoCart/HisopadoCart'
import Referred from "./components/DeliveryService/Referred"
import AccessDenied from './components/GeneralComponents/AccessDenied';
import Install from './views/Install.js';
import RegisterSuccess from './views/RegisterSuccess.js';
import RedirectWs from './views/RedirectWs.js';
import Whatsapp from './views/Whatsapp.js';
import Payment from "./components/Payment"
import DeliveryChat from "./components/DeliveryService/DeliveryChat"
import Pillbox from "./components/Pillbox/Pillbox"
import Constancy from "./components/DeliveryService/DeliveryResults/Components/Constancy/ConstancyHisopado.js"
import TransportRating from './components/Transport/TransportRating.js';
/* Vaccine */
import Vaccine from './components/Vaccine';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.scss';
/* Support */
import Support from './views/Support'
/* IOMA */
import HisopadoCorporate from './components/DeliveryService/HisopadoCorporate';
import Invitation from './views/Invitation';

// TODO:  revisar login despues de pantalla status
// TODO: eliminar la contraseña  de redux una vez que se crea el usuario

function App(props) {
	return (
		<div className='App'>
			<Switch>
				{/* LOGIN / REGISTER / RECOVERY */}
				<Route exact path='/login/phone' component={LoginPhoneNumber} />
				<Route exact path='/login/error' component={ForgottenAccError} />
				<Route exact path='/login/code' component={ConfirmationCode} />
				<Route exact path='/login/welcomeAgain/:method?' component={WelcomeAgain} />
				<Route exact path='/signup' component={SignUp} />
				<Route exact path='/signup/form/:screen' component={SignUpForm} />
				<Route exact path='/signup/:status' component={Status} />

				<Route exact path='/reset' component={Reset} />
				<Route exact path='/accessDenied' component={AccessDenied} />
				<Route exact path='/:ws?/welcome' component={Welcome} />
				<Route exact path='/:ws?/sendws' component={Whatsapp} />
				<Route exact path='/redirectws/:ws' component={RedirectWs} />
				<Route exact path='/login/:ws?' component={Login} />
				<Route exact path='/:ws?/core/:core?' component={LoginWithCore} />
				<Route exact path='/register/:ws/:ref?' component={Register} />
				<Route exact path='/:ws?/login' component={Login} /> {/* To be deleted */}
				<Route exact path='/:ws/register/:ref?' component={Register} /> {/* To be deleted */}
				<PrivateRoute exact path='/umacare/:ws?' component={UmaCare} />
				{/* New Register */}
				<Route exact path='/install/:ref?' component={Install} />
				<Route exact path='/newregister/:ref?' component={RegisterNew} />
				<Route exact path='/referredregister/:ref?' component={RegisterNew} />
				{/* <Route exact path='/referredRegister/:ref?' component={ReferredRegister} /> */}
				<Route exact path='/registersuccess' component={RegisterSuccess} />
				{/* Referred Register Index */}
				<PrivateRoute exact path='/referred/:ws?/:ref?' component={Referred} />
				{/* General */}
				<Route exact path='/feedback/:aid?' component={Feedback} />
				<Route exact path='/notfound/:error?' component={NotFound} />
				<PrivateRoute exact path='/:ws?' component={Home} />
				<PrivateRoute exact path='/home/:ws?' component={Home} />
				<PrivateRoute exact path='/:ws/constancy' component={Constancy} />
				{/* Doctor Online */}
				<PrivateRoute exact path='/onlinedoctor/when/:dni' component={When} />
				<PrivateRoute exact path='/onlinedoctor/who/:dni' component={Who} />
				<PrivateRoute exact path='/onlinedoctor/questions/:dni' component={Questions} />
				<PrivateRoute exact path='/onlinedoctor/reason/:dni' component={Reason} />
				<PrivateRoute exact path='/onlinedoctor/queue/:dni' component={AttQueue} />
				<PrivateRoute exact path='/onlinedoctor/attention/:dni?' component={CallContainer} />
				<PrivateRoute exact path='/onlinedoctor/attention/:dni?' component={CallContainer} />
				<PrivateRoute exact path='/:dni?/onlinedoctor/attention' component={CallContainer} /> 
				<PrivateRoute exact path='/onlinedoctor/rating/:ws' component={Rating} />
				{/* CUIDADOS DOMICILIARIOS */}
				<PrivateRoute exact path='/homeCare/:ws?/' component={ComingSoon} />
				{/* MY HISTORY */}
				<PrivateRoute exact path='/record/:ws' component={MyRecords} />
				<PrivateRoute exact path='/history/:ws' component={MyHistory} />
				<PrivateRoute exact path='/history/:category' component={MyRecords} />
				<PrivateRoute exact path='/history/:dni?/:record?/:recipe?' component={History} /> 
				<PrivateRoute exact path='/recipes/:ws?' component={RecipeSection} />
				{/* PROFILE */}
				<PrivateRoute path='/:ws?/profile/' component={Profile} />
				{/* APPOINTMENTS ONLINE */}
				{/* Temp disabled the chats <PrivateRoute exact path='/chat/:specialty/:dni?' component={Chat} /> */}
				<PrivateRoute exact path='/appointmentsonline/who' component={Who} />
				<PrivateRoute exact path='/appointmentsonline/pending/:dni' component={AppointmentsOnlineHistory} />
				<PrivateRoute exact path='/appointmentsonline/:dni/' component={OnlineSpecialist} />
				<PrivateRoute exact path='/appointmentsonline/specialty/:dni' component={ListSpecialties} />
				<PrivateRoute exact path='/appointmentsonline/search-doctor/:dni' component={SearchDoctorOnline} />
				<PrivateRoute exact path='/appointmentsonline/:condition/selectsymptoms/:dni' component={SelectSymptoms} />
				<PrivateRoute exact path='/appointmentsonline/:condition/calendar/:dni' component={CalendarOnline} />
				{/* TRASLADOS */}
				<PrivateRoute exact path='/survey/ws=:ws&:asid=:asid&dni=:dni' component={Survey} />
				<PrivateRoute exact path='/:ws/transport' component={TransportMain} />
				<PrivateRoute exact path='/:ws/transportRegister' component={TransportRegister} />
				<PrivateRoute exact path='/:ws/transportUserActive' component={TransportUserActive} />
				<PrivateRoute exact path='/:ws/createTransportRoute' component={CreateTransportRouteView} />
				<PrivateRoute exact path='/:ws/scheduleTransport' component={ScheduleTransportView} />
				<PrivateRoute exact path='/transportDetails/:date/:assignation_id' component={TransportDetailsView} />
				<PrivateRoute exact path='/:ws/scheduledTransportSuccess' component={ScheduledTransportSuccess} />
				<PrivateRoute exact path='/transportNoDriver' component={TransportNoDriver} />
				<PrivateRoute exact path='/:ws/transportRating/:assignation_id' component={TransportRating} />
				{/* AUTONOMOUS */}
				<PrivateRoute exact path='/:dni/autonomous' component={Autonomous} />
				<PrivateRoute exact path='/:dni/laboratorio' component={Laboratorio} />
				{/* Wellness */}
				<PrivateRoute exact path='/:ws?/wellness' component={Wellness} />
				{/* Patient tracking */}
				<Route exact path='/:ws/umacare/:key?/:data?' component={SymptomsTracking} />
				{/* Delivery Service */}
				<PrivateRoute exact path='/hisopado/listTracker/:ws?' component={DeliveryListTracker} />
				<PrivateRoute exact path='/hisopado/carrito/:ws?' component={HisopadoCart} />
				<Route exact path='/hisopado/cobertura/:ws?' component={DeliveryCoverage} />
				<PrivateRoute exact path='/hisopado/:ws?' component={DeliveryPurchase} />
				<PrivateRoute exact path='/hisopadoResult/:ws?' component={DeliveryResults} />
				<PrivateRoute exact path='/hisopado/payment/:ws?' component={Payment} />
				<PrivateRoute exact path='/hisopado/corporate/:ws?' component={HisopadoCorporate} />
				<PrivateRoute exact path='/hisopado/deliveryChat/:incidente_id' component={DeliveryChat} />
				<PrivateRoute exact path='/delivery/progress/:ws?/:incidente_id/:service?' component={DeliveryTrackProgress} />
				{/* VACCINE */}
				<Route exact path='/invitation/:id' component={Invitation} />
				<Route exact path='/vacunacion/:id' component={Vaccine} />
				{/* PILLBOX */}
				<PrivateRoute exact path='/pillbox/:ws?' component={Pillbox} />
				{/* SUPPORT */}
				<PrivateRoute exact path='/support/:section?' component={Support} />
				{/* ACCESS DENIED */}
				<Route exact path='/:ws?/comingSoon' component={ComingSoon} />
				{/* NOT FOUND */}
				<Route component={NotFound} />
			</Switch>
		</div>
	);
}

export default App;
