import { combineReducers } from 'redux';
import queries from './queriesReducers';
import front from './frontReducers';
import assignations from './assignReducers';
import assessment from './assessmentReducers';
import biomarkers from './biomarkersReducer';
import call from './callReducers';
import survey from './surveyReducers';
import userActive from './userActiveReducers';
import onboardingSecondStep from './onboardingSecondStepReducers';
import onboardingThirdStep from './onboardingThirdStepReducers';
import user from './userReducers';
import autonomous from './autonomousReducers';
import umacare from './umacareReducers';
import deliveryService from './deliveryReducers';
import transport from './transportReducer';
import pillbox from './pillboxReducer';
import cx from './cxReducers';

const appReducer = combineReducers({
	assessment,
	assignations,
	autonomous,
	biomarkers,
	cx,
	call,
	deliveryService,
	front,
	queries,
	onboardingSecondStep,
	onboardingThirdStep,
	pillbox,
	user,
	survey,
	umacare,
	transport,
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
