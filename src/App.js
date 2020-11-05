import React from 'react';
import { Route, Switch } from 'react-router-dom';
/* History */
import History from './views/History.js';
/* User */
import PrivateRoute from './PrivateRoute';
import Welcome from './views/Welcome';
import Reset from './views/Reset';
import Feedback from './views/Feedback';
import ResetPassword from './components/User/ResetPassword';
import Login from './components/User/Login';
import LoginWithCore from './components/User/LoginWithCore';
import Home from './views/Home';
import Register from './views/Register';
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
import Derivations from './components/VMD/Derivations';
// Survey and Transport 
import Survey from './components/Transport/Survey';
import TransportMain from './components/Transport/TransportMain';
import TransportRegister from './components/Transport/TransportRegister';
import TransportUserActive from './components/Transport/TransportUserActive';
import CreateTransportRouteView from './views/CreateTransportRouteView';
import ScheduleTransportView from './views/ScheduleTransportView';
import TransportDetailsView from './views/TransportDetailsView';
// Appointments Online
import OnlineSpecialist from './components/AppointmentsOnline/';
import ListSpecialties from './components/AppointmentsOnline/ListSpecialties';
import SearchDoctorOnline from './components/AppointmentsOnline/SearchDoctor';
import SelectSymptoms from './components/AppointmentsOnline/SelectSymptoms';
import CalendarOnline from './components/AppointmentsOnline/Calendar';
import AppointmentsOnlineHistory from './components/AppointmentsOnline/AppointmentsOnlineHistory';
import Questions from './components/OnlineDoctor/Questions/';
/* Survey and Transport */
import AmbulanceComponent from './components/Ambulance/AmbulanceComponent';
/* Autonomous */
import Autonomous from './components/Autonomous/';
/* Laboratorio */
import Laboratorio from './components/Laboratorio';
/* Wellness */
import Wellness from './views/Wellness';
import Chat from './views/Chat';
/* DeliveryService */
import DeliveryTrackProgress from './components/DeliveryService/DeliveryTrackProgress.js';
/* SymptomsTracking */
import SymptomsTracking from './views/SymptomsTrackingView';
import UmaCare from './components/UmaCare/index.js';
/* Autonomous */
import DeliveryPurchase from "./components/DeliveryService/DeliveryPurchase"
import DeliveryCoverage from './components/DeliveryService/DeliveryCoverage'
import DeliveryResults from "./components/DeliveryService/DeliveryResults"
import Referred from "./components/DeliveryService/Referred"
import Derived from './components/OnlineDoctor/Derived/Derived';
import AccessDenied from './components/GeneralComponents/AccessDenied';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.scss';

function App(props) {
	return (
		<div className='App'>
			<Switch>
				{/* LOGIN / REGISTER / RECOVERY */}
				<Route exact path='/reset' component={Reset} />
				<Route exact path='/accessDenied' component={AccessDenied} />
				<Route exact path='/:ws?/welcome' component={Welcome} />
				<Route exact path='/login/:ws?' component={Login} />
				<Route exact path='/:ws?/core/:core?' component={LoginWithCore} />
				<Route exact path='/register/:ws/:ref?' component={Register} />
				<Route exact path='/:ws?/login' component={Login} /> {/* To be deleted */}
				<Route exact path='/:ws/register/:ref?' component={Register} /> {/* To be deleted */}
				<Route exact path='/:ws?/recovery' component={ResetPassword} />
				<PrivateRoute exact path='/:ws?/umacare' component={UmaCare} />
				{/* General */}
				<Route exact path='/feedback/:aid?' component={Feedback} />
				<Route exact path='/notfound/:error?' component={NotFound} />
				<PrivateRoute exact path='/:ws?' component={Home} />
				{/* Doctor Online */}
				<PrivateRoute exact path='/:dni/onlinedoctor/when' component={When} />
				<PrivateRoute exact path='/:dni/onlinedoctor/who' component={Who} />
				<PrivateRoute exact path='/:dni/onlinedoctor/questions' component={Questions} />
				<PrivateRoute exact path='/:dni/onlinedoctor/reason' component={Reason} />
				<PrivateRoute exact path='/:dni/onlinedoctor/queue' component={AttQueue} />
				<PrivateRoute exact path='/:dni/onlinedoctor/derived' component={Derived} />
				<PrivateRoute exact path='/:dni/onlinedoctor/attention/:token?' component={CallContainer} />
				<PrivateRoute exact path='/:ws/onlinedoctor/rating' component={Rating} />
				{/* VMD and DERIVATIONS*/}
				<PrivateRoute exact path='/:ws/vmd' component={ComingSoon} />
				<PrivateRoute exact path='/:ws/derivations' component={Derivations} />
				{/* AMBULANCE */}
				<PrivateRoute exact path='/:ws/ambulance' component={ComingSoon} />
				<PrivateRoute exact path='/:ws/ambulancetime' component={AmbulanceComponent} />
				{/* CUIDADOS DOMICILIARIOS */}
				<PrivateRoute exact path='/:ws?/homeCare' component={ComingSoon} />
				{/* MY HISTORY */}
				<PrivateRoute exact path='/:ws/history/:dni?/:record?' component={History} />
				<PrivateRoute from='/:ws/record' to='/:ws/history/' />
				{/* PROFILE */}
				<PrivateRoute path='/:ws?/profile/' component={Profile} />
				{/* APPOINTMENTS ONLINE */}
				<PrivateRoute exact path='/:dni?/chat/:specialty' component={Chat} />
				<PrivateRoute exact path='/appointmentsonline/who' component={Who} />
				<PrivateRoute exact path='/:dni/appointmentsonline/' component={OnlineSpecialist} />
				<PrivateRoute exact path='/:dni/appointmentsonline/specialty' component={ListSpecialties} />
				<PrivateRoute exact path='/:dni/appointmentsonline/search-doctor' component={SearchDoctorOnline} />
				<PrivateRoute exact path='/:dni/appointmentsonline/:condition/selectsymptoms' component={SelectSymptoms} />
				<PrivateRoute exact path='/:dni/appointmentsonline/:condition/calendar' component={CalendarOnline} />
				<PrivateRoute exact path='/:dni/appointmentsonline/:scheduled?/history' component={AppointmentsOnlineHistory} />
				{/* TRASLADOS */}
				<PrivateRoute exact path='/survey/ws=:ws&:asid=:asid&dni=:dni' component={Survey} />
				<PrivateRoute exact path='/:ws/transport' component={TransportMain} />
				<PrivateRoute exact path='/:ws/transportRegister' component={TransportRegister} />
				<PrivateRoute exact path='/:ws/transportUserActive' component={TransportUserActive} />
				<PrivateRoute exact path='/:ws/createTransportRoute' component={CreateTransportRouteView} />
				<PrivateRoute exact path='/:ws/scheduleTransport' component={ScheduleTransportView} />
				<PrivateRoute exact path='/:dni/transportDetails/:incidente_id' component={TransportDetailsView} />
				{/* AUTONOMOUS */}
				<PrivateRoute exact path='/:dni/autonomous' component={Autonomous} />
				<PrivateRoute exact path='/:dni/laboratorio' component={Laboratorio} />
				{/* Wellness */}
				<PrivateRoute exact path='/:ws?/wellness' component={Wellness} />
				{/* Patient tracking */}
				<PrivateRoute exact path='/:ws/umacare/:key?/:data?' component={SymptomsTracking} />
				{/* Delivery Service */}
				<PrivateRoute
					exact
					path='/hisopado/:ws?'
					component={DeliveryPurchase}
				/>
				<PrivateRoute
					exact
					path='/hisopado/cobertura/:ws?'
					component={DeliveryCoverage}
				/>
				<PrivateRoute
					exact
					path='/hisopadoResult/:ws?'
					component={DeliveryResults}
				/>
				<PrivateRoute exact path='/delivery/progress/:ws?/:incidente_id/:service?' component={DeliveryTrackProgress} />
				
				<Route exact path='/referred/:ws?' component={Referred} />
				{/* ACCESS DENIED */}
				<Route exact path='/:ws?/comingSoon' component={ComingSoon} />
				{/* NOT FOUND */}
				
				<Route component={NotFound} />
			</Switch>
		</div>
	);
}

export default App;
