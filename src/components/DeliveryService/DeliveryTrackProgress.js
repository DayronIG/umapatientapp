import React from 'react';
import { useSelector } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import PackageOnTheWay from './PackageOnTheWay';
import Loading from '../GeneralComponents/Loading';
import NotService from './NotService';
import EndAssignationHisopado from "../DeliveryService/DeliveryPurchase/Components/EndAssignationHisopado"
import '../../styles/deliveryService/trackProgress.scss';

const DeliveryTrackProgress = () => {
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
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
			<GenericHeader children="Hisopado" />
			<section className='trackProgress__container'>
				{loading && <Loading />}
				<div className='trackProgress__content'>
					{renderComponentByTrackProgress(status)}
				</div>
			</section>
		</div>
	);
};

export default DeliveryTrackProgress;
