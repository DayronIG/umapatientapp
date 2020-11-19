import { combineReducers } from 'redux';
import queries from './patientReducers';
import front from './frontReducers';
import assignations from './assignReducers';
import assessment from './assessmentReducers';
import biomarkers from './biomarkersReducer';
import call from './callReducers';
import survey from './surveyReducers';
import userActive from './userActiveReducers';
import onboardingSecondStep from './onboardingSecondStepReducers';
import onboardingThirdStep from './onboardingThirdStepReducers';
import register from './registerReducers';
import pol from './polReducers';
import autonomous from './autonomousReducers';
import umacare from './umacareReducers';
import deliveryService from './deliveryReducers';
import transport from './transportReducer';
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
	pol,
	register,
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
			userActive: state.userActive
		};
	}
	return appReducer(state, action);
};

export default rootReducer;
