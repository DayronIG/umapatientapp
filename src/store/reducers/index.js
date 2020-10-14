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
import deliveryService from './deliveryReducers';
import cx from './cxReducers';

const appReducer = combineReducers({
	assessment,
	assignations,
	autonomous,
	biomarkers,
	cx,
	call,
	front,
	queries,
	onboardingSecondStep,
	onboardingThirdStep,
	pol,
	register,
	survey,
	userActive,
	deliveryService,
});

const rootReducer = (state, action) => {
	if (action.type === 'RESET_ALL') {
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
