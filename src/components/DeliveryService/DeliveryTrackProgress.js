import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GenericHeader } from '../GeneralComponents/Headers';
import {BackButton} from "../GeneralComponents/Headers"
import PackageOnTheWay from './PackageOnTheWay';
import Loading from '../GeneralComponents/Loading';
import NotService from './NotService';
import EndAssignationHisopado from "../DeliveryService/DeliveryPurchase/Components/EndAssignationHisopado"
import '../../styles/deliveryService/trackProgress.scss';

const DeliveryTrackProgress = () => {
	const history = useHistory();
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const patient = useSelector(state => state.user)
	const { status } = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]) || "NOT:SERVICE";
	const { loading } = useSelector(state => state.front);

	const renderComponentByTrackProgress = (step) => {
		if (status && status !== 'FREE' && status !== "FREE:IN_RANGE") {
			switch (step) {
				case 'PREASSIGN': return <EndAssignationHisopado />;
				case 'ASSIGN:DELIVERY': return <PackageOnTheWay active={1} />;
				case 'ASSIGN:ARRIVED': return <PackageOnTheWay active={2} />;
				case 'DONE:RESULT': return <PackageOnTheWay active={3} />;
				default: return <NotService />; 
			}
		} else {
			return <NotService />;
		}
	};

	return (
		<div className="trackProgress">
			<div className="back-button">
				<BackButton inlineButton={true} customTarget={patient.ws} action={()=>history.push(`/hisopado/listTracker/${patient.ws}`)} />
			</div>
			<section className='trackProgressVertical__container'>
				{loading && <Loading />}
				<div className='trackProgressVertical__content'>
					{renderComponentByTrackProgress(status)}
				</div>
			</section>
		</div>
	);
};

export default DeliveryTrackProgress;
