import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { GenericHeader } from '../GeneralComponents/Headers';
import PackageOnTheWay from './PackageOnTheWay';
import SearchingProfessional from './SearchingProfessional';
import Loading from '../GeneralComponents/Loading';
import NotService from './NotService';
import '../../styles/deliveryService/trackProgress.scss';

const DeliveryTrackProgress = () => {
	const { status } = useSelector(state => state.deliveryService.current);
	const user = useSelector(state => state.queries.patient);
	const { loading } = useSelector(state => state.front);
	const history = useHistory();

	const renderComponentByTrackProgress = (step) => {
		if (status && status !== 'FREE' && status !== "FREE:IN_RANGE") {
			switch (step) {
				case 'PREASSIGN': return <SearchingProfessional active={0} />;
				case 'ASSIGN:DELIVERY': return <PackageOnTheWay active={1} />;
				case 'ASSIGN:ARRIVED': return <PackageOnTheWay active={2} />;
				case 'DONE:RESULT': return <PackageOnTheWay active={3} />;
				// case 'DONE:RESULT': {
				// 	if(user.ws){
				// 		history.push(`/hisopadoResult/${user.ws}`);
				// 	}
				// 	return;
				// }
				default: return <NotService />; 
			}
		} else if(status && status === 'FREE' || status === "FREE:IN_RANGE") {
			history.push(`/hisopado/${user.ws}`);
		} else {
			return <NotService />;
		}
	};

	return (
		<div className="trackProgress">
			<GenericHeader children="Hisopado" />
			<section className='trackProgress__container'>
				{loading && <Loading />}
				<div className='trackProgress__content'>
					{/* {renderComponentByTrackProgress(modifiedObjService.status_derivacion)} */}
					{renderComponentByTrackProgress(status)}
				</div>
			</section>
		</div>
	);
};

export default DeliveryTrackProgress;
