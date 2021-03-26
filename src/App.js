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
import Home from './views/Home';
import Status from './components/User/SignUp/Status';

// Login & Register
import LoginPhoneNumber from './components/User/Login/LoginPhoneNumber/LoginPhoneNumber';
import ForgottenAccError from './components/User/Login/ForgottenPass/ForgottenAccError';
import ConfirmationCode from './components/User/SignUp/ConfirmationCode';
import WelcomeAgain from './components/User/Login/LoginPhoneNumber/WelcomeAgain';
import SignUp from './components/User/SignUp/SignUp';
import SignUpForm from './components/User/SignUp/Register';
import AlreadyExists from './components/User/SignUp/AlreadyExists';
import NeedHelp from './components/User/Login/ForgottenPass/NeedHelp';
import ForgottenPass from './components/User/Login/ForgottenPass/ForgottenPass';
import ForgottenPassError from './components/User/Login/ForgottenPass/ForgottenPassError';
import ConfirmAcc from './components/User/Login/ForgottenPass/ConfirmAcc';

/* Profile */
import Profile from './views/Profile';
import Antecedents from './components/Profile/MyBackground/Antecedent';
/* Online Doctor */
import Who from './components/OnlineDoctor/WhoScreen/WhoScreen';
import When from './components/OnlineDoctor/WhenScreen/WhenAtt';
import Reason from './components/OnlineDoctor/Reason/';
import AttQueue from './components/OnlineDoctor/AttQueue';
import CallContainer from './components/OnlineDoctor/StartCall/';
import ComingSoon from './components/GeneralComponents/ComingSoon';
import NotFound from './components/GeneralComponents/NotFound';
// Survey and Transport 
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
import TermsConditions from './components/DeliveryService/DeliveryPurchase/Components/TermsConditions.js';

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
				<Route exact path='/signup/user/exists/:method?' component={AlreadyExists} />
				<Route exact path='/forgot/finalStep/:method' component={ConfirmAcc} />
				<Route exact path='/forgot/:type' component={ForgottenPass} />
				<Route exact path='/forgot/error/:method' component={ForgottenPassError} />
				<Route exact path='/forgot' component={NeedHelp} />
				<Route exact path='/termsconditions' component={TermsConditions} />
				<Route exact path='/reset' component={Reset} />
				<Route exact path='/accessDenied' component={AccessDenied} />
				<Route exact path='/:ws?/welcome' component={Welcome} />
				<Route exact path='/:ws?/sendws' component={Whatsapp} />
				<Route exact path='/redirectws/:ws' component={RedirectWs} />
				<Route exact path='/old_login/:ws?' component={Login} />
				<PrivateRoute exact path='/umacare/:ws?' component={UmaCare} />
				{/* New Register */}
				<Route exact path='/install/:ref?' component={Install} />
				{/* Referred Register Index */}
				<PrivateRoute exact path='/referred/:ws?/:ref?' component={Referred} />
				{/* Delivery Service */}
				<Route exact path='/hisopado/cobertura/:ws?' component={DeliveryCoverage} />
				<PrivateRoute exact path='/hisopado/listTracker/:ws?' component={DeliveryListTracker} />
				<PrivateRoute exact path='/hisopado/carrito/:ws?' component={HisopadoCart} />
				<PrivateRoute exact path='/hisopado/:ws?' component={DeliveryPurchase} />
				<PrivateRoute exact path='/hisopadoResult/:ws?' component={DeliveryResults} />
				<PrivateRoute exact path='/hisopado/payment/:ws?' component={Payment} />
				<PrivateRoute exact path='/hisopado/corporate/:ws?' component={HisopadoCorporate} />
				<PrivateRoute exact path='/hisopado/deliveryChat/:incidente_id' component={DeliveryChat} />
				<PrivateRoute exact path='/delivery/progress/:ws?/:incidente_id/:service?' component={DeliveryTrackProgress} />
				{/* General */}
				<Route exact path='/feedback/:aid?' component={Feedback} />
				<Route exact path='/notfound/:error?' component={NotFound} />
				<PrivateRoute exact path='/:ws?' component={Home} />
				<PrivateRoute exact path='/home/:ws?' component={Home} />
				<PrivateRoute exact path='/:ws/constancy' component={Constancy} />
				{/* Doctor Online */}
				<PrivateRoute exact path='/onlinedoctor/who' component={Who} />
				<PrivateRoute exact path='/onlinedoctor/when/:activeUid?' component={When} />
				<PrivateRoute exact path='/onlinedoctor/questions/:activeUid?' component={Questions} />
				<PrivateRoute exact path='/onlinedoctor/reason/:activeUid?' component={Reason} />
				<PrivateRoute exact path='/onlinedoctor/queue/:activeUid?' component={AttQueue} />
				<PrivateRoute exact path='/onlinedoctor/attention/:activeUid?' component={CallContainer} />
				{/* CUIDADOS DOMICILIARIOS */}
				<PrivateRoute exact path='/homeCare/:ws?/' component={ComingSoon} />
				{/* MY HISTORY */}
				<PrivateRoute exact path='/record/:ws' component={MyRecords} />
				<PrivateRoute exact path='/history/:ws' component={MyHistory} />
				<PrivateRoute exact path='/history/:category' component={MyRecords} />
				<PrivateRoute exact path='/history/:dni?/:record?/:recipe?' component={History} /> 
				<PrivateRoute exact path='/recipes/:ws?' component={RecipeSection} />
				{/* PROFILE */}
				<PrivateRoute path='/profile/:uid?' component={Profile} />
				<PrivateRoute path='/antecedents/:uid?/:section' component={Antecedents}/> 
				{/* APPOINTMENTS ONLINE */}
				<PrivateRoute exact path='/appointmentsonline/who' component={Who} />
				<PrivateRoute exact path='/appointmentsonline/pending/:activeUid?/' component={AppointmentsOnlineHistory} />
				<PrivateRoute exact path='/appointmentsonline/:activeUid?/' component={OnlineSpecialist} />
				<PrivateRoute exact path='/appointmentsonline/specialty/:activeUid?/' component={ListSpecialties} />
				<PrivateRoute exact path='/appointmentsonline/search-doctor/:activeUid?/' component={SearchDoctorOnline} />
				<PrivateRoute exact path='/appointmentsonline/:condition/selectsymptoms/:activeUid?/' component={SelectSymptoms} />
				<PrivateRoute exact path='/appointmentsonline/:condition/calendar/:activeUid?/' component={CalendarOnline} />
				{/* TRASLADOS */}
				<PrivateRoute exact path='/:ws/transport' component={TransportMain} />
				<PrivateRoute exact path='/:ws/transportRegister' component={TransportRegister} />
				<PrivateRoute exact path='/:ws/transportUserActive' component={TransportUserActive} />
				<PrivateRoute exact path='/:ws/createTransportRoute' component={CreateTransportRouteView} />
				<PrivateRoute exact path='/:ws/scheduleTransport' component={ScheduleTransportView} />
				<PrivateRoute exact path='/:ws/scheduledTransportSuccess' component={ScheduledTransportSuccess} />
				<PrivateRoute exact path='/:ws/transportRating/:assignation_id' component={TransportRating} />
				<PrivateRoute exact path='/transportNoDriver' component={TransportNoDriver} />
				<PrivateRoute exact path='/transportDetails/:date/:assignation_id' component={TransportDetailsView} />
				{/* AUTONOMOUS */}
				<PrivateRoute exact path='/autonomous/:dni' component={Autonomous} />
				<PrivateRoute exact path='/laboratorio/:dni' component={Laboratorio} />
				{/* Wellness */}
				<PrivateRoute exact path='/wellness/:ws?' component={Wellness} />
				{/* Patient tracking */}
				<Route exact path='/:ws/umacare/:key?/:data?' component={SymptomsTracking} />
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
