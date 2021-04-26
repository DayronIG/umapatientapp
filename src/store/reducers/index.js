import { combineReducers } from 'redux';
import assessment from './assessmentReducers';
import assignations from './assignReducers';
import autonomous from './autonomousReducers';
import biomarkers from './biomarkersReducer';
import call from './callReducers';
import cx from './cxReducers';
import deliveryService from './deliveryReducers';
import derivations from './derivationsReducers';
import front from './frontReducers';
import inPersonService from './inPersonServiceReducers'
import onboardingSecondStep from './onboardingSecondStepReducers';
import onboardingThirdStep from './onboardingThirdStepReducers';
import payments from './payments';
import pillbox from './pillboxReducer';
import queries from './queriesReducers';
import survey from './surveyReducers';
import transport from './transportReducer';
import umacare from './umacareReducers';
import user from './userReducers';
import userActive from './userActiveReducers';

const appReducer = combineReducers({
	assessment,
	assignations,
	autonomous,
	biomarkers,
	call,
	cx,
	deliveryService,
	derivations,
	front,
	inPersonService,
	onboardingSecondStep,
	onboardingThirdStep,
	payments,
	pillbox,
	queries,
	survey,
	transport,
	umacare,
	user,
	userActive,
});

const rootReducer = (state, action) => {
	if (action.type === 'RESET_ALL') {
		state = { 
			queries: state.queries, 
			deliveryService: state.deliveryService,
			user: state.user,
			userActive: state.userActive
		};
	}
	return appReducer(state, action);
};

export default rootReducer;
