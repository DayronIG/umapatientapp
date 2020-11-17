import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { FaCheckCircle } from 'react-icons/fa';

export default function DeliveryProgressBar({ percent }) {
	const [qty, setQty] = useState(20);
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const { fullname_nurse } = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.delivery);

	useEffect(() => {
		switch(percent) {
			case 0: setQty(25);
			break;
			case 1: setQty(50);
			break;
			case 2: setQty(75);
			break;
			case 3: setQty(100);
			break;
		}
	}, [percent])

	return (
		<div id="progressBar" className={`fill_${qty}`}>
			<ProgressBar filledBackground='#009042' percent={qty}>
				<Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							<FaCheckCircle />
							<div className='trackProgress__container--text'>
								<h3>En preparación</h3>
								<p>El personal de salud  está preparando su equipo</p>
							</div>
						</div>
					)}
				</Step>
				<Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							<FaCheckCircle />
							<div className='trackProgress__container--text'>
								<h3>En camino</h3>
								<p><span>{fullname_nurse ? fullname_nurse : 'Tu profesional'}</span> está en camino</p>
							</div>
						</div>
					)}
				</Step>
				<Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							<FaCheckCircle />
							<div className='trackProgress__container--text'>
								<h3>En domicilio</h3>
								<p><span>{fullname_nurse ? fullname_nurse : 'Tu profesional'}</span> ha llegado al domicilio</p>
							</div>
						</div>
					)}
				</Step>
				{/* <Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							<FaCheckCircle />
							<div className='trackProgress__container--text'>
								<h3>Hisopado</h3>
								<p>Se ha realizado el hisopado</p>
							</div>
						</div>
					)}
				</Step> */}
				<Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							<FaCheckCircle />
							<div className='trackProgress__container--text'>
								<h3>Resultado</h3>
								<p>Se ha cargado el resultado</p>
							</div>
						</div>
					)}
				</Step>
			</ProgressBar>
		</div>
	);
}
