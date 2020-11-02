import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { GenericHeader } from '../GeneralComponents/Headers';
import PackageOnTheWay from './PackageOnTheWay';
import SearchingProfessional from './SearchingProfessional';
import Hisopado from './AnalysisSteps/Hisopado';
import Result from './AnalysisSteps/Result';
import Loading from '../GeneralComponents/Loading';
import NotService from './NotService';
import '../../styles/deliveryService/trackProgress.scss';
import { listenToChangesInService, modifyServiceToProgress } from '../../store/actions/deliveryActions';
import DeliveryProgressBar from './DeliveryProgressBar';
import DeliverySelectDestiny from './DeliverySelectDestiny';
import WaitingCorporate from './WaitingCorporate';
import Laboratory from './AnalysisSteps/Laboratory';
import FooterBtn from '../GeneralComponents/FooterBtn';

const DeliveryTrackProgress = () => {
	const { currentService, modifiedObjService } = useSelector(state => state.deliveryService);
	const user = useSelector(state => state.queries.patient);
	const { loading } = useSelector(state => state.front);
	const { incidente_id } = useParams();
	const history = useHistory();

	// useEffect(() => {
	// 	modifyServiceToProgress(currentService);
	// }, [currentService]);

	// useEffect(() => {
	// 	const subscription = listenToChangesInService(incidente_id);
	// 	return () => {
	// 		if (typeof subscription === 'function') subscription();
	// 	};
	// }, []);

	const renderComponentByTrackProgress = (step) => {
		// if (currentService?.status_derivacion && step !== "PREASSIGN") {
		switch (step) {
			// case 'PREASSIGN:VALIDATE': return <WaitingCorporate />;
			case 'PREASSIGN:READY': return <SearchingProfessional />;
			case 'ASSIGN': return <PackageOnTheWay />;
			case 'ASSIGN:READY': return <PackageOnTheWay />;
			case 'DONE:HISOPADO': return <PackageOnTheWay />;
			// case 'DONE:IN_LAB': return <Laboratory />
			case 'DONE:RESULT': {
				if(user.ws){
					history.push(`/hisopadoResult/${user.ws}`);
				}
				return;
			}
			default: return <NotService />; 
		}
		// } else if (user._start_date === 'geo' || step === "PREASSIGN") {
		// 	return <DeliverySelectDestiny />
		// } else {
		// 	return <NotService />
		// }
	};

	return (
		<div className="trackProgress">
			<GenericHeader children="Hisopado" />
			<section className='trackProgress__container'>
				{loading && <Loading />}
				{/* {modifiedObjService?.status_derivacion && modifiedObjService?.status_derivacion !== "PREASSIGN" &&
					<>
						<div className='progressBar'>
							<DeliveryProgressBar progress={modifiedObjService.progress} percent={modifiedObjService.percent} />
						</div>
						<FooterBtn
							mode='single'
							text='Volver'
							callback={() => history.push('/')}
						/>
					</>} */}
				<div className='trackProgress__content'>
					{/* {renderComponentByTrackProgress(modifiedObjService.status_derivacion)} */}
					{renderComponentByTrackProgress('DONE:HISOPADO')}
				</div>
			</section>
		</div>
	);
};

export default DeliveryTrackProgress;
