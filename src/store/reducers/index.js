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
import onboardingSecondStep from './onboardingSecondStepReducers';
import onboardingThirdStep from './onboardingThirdStepReducers';
import pillbox from './pillboxReducer';
import queries from './queriesReducers';
import survey from './surveyReducers';
import transport from './transportReducer';
import umacare from './umacareReducers';
import user from './userReducers';
import userActive from './userActiveReducers';
import userHistory from './userHistoryReducers';
import payments from './payments';

const appReducer = combineReducers({
	assessment,
	assignations,
	autonomous,
	biomarkers,
	cx,
	call,
	deliveryService,
	derivations,
	front,
	userHistory,
	queries,
	onboardingSecondStep,
	onboardingThirdStep,
	pillbox,
	user,
	survey,
	umacare,
	transport,
	userActive,
	payments,
});

const rootReducer = (state, action) => {
	if (action.type === 'RESET_ALL') {
		state = { 
			queries: state.queries, 
			deliveryService: state.deliveryService,
			user: state.user,
			userActive: state.userActive,
			userHistory: state.userHistory
		};
	}
	return appReducer(state, action);
};

export default rootReducer;
