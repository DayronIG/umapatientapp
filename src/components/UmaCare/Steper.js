import React from 'react';
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from 'react-icons/io';
import { ProgressBar, Step } from 'react-step-progress-bar';

const Steper = ({ percent, color, result }) => {
	const returnIcon = (accomplished) => {
		if (accomplished) {
			return <IoIosRadioButtonOn />;
		} else {
			return <IoIosRadioButtonOff />;
		}
	};

	return (
		<div className={`tracking__progress ${color ? color : 'gray'}`}>
			<h5>Estado Actual día {} de {}</h5>
			<div className='progressbar'>
				<ProgressBar percent={percent}>
					<Step>
						{({ accomplished }) => (
							<div className={`indexedStep ${accomplished ? 'accomplished' : ''}`}>
								{returnIcon(accomplished)}
							</div>
						)}
					</Step>
					<Step>
						{({ accomplished }) => (
							<div className={`indexedStep ${accomplished ? 'accomplished' : ''}`}>
								{returnIcon(accomplished)}
							</div>
						)}
					</Step>
					<Step>
						{({ accomplished }) => (
							<div className={`indexedStep ${accomplished ? 'accomplished' : ''}`}>
								{returnIcon(accomplished)}
							</div>
						)}
					</Step>
					<Step>
						{({ accomplished }) => (
							<div className={`indexedStep ${accomplished ? 'accomplished' : ''}`}>
								{returnIcon(accomplished)}
							</div>
						)}
					</Step>
				</ProgressBar>
			</div>
			<div className='detalles-status'>
				<p className={`${percent >= 0 && 'active'}`}>Hisopado</p>
				<p className={`${percent >= 35 && 'active'}`}>
					{(result === 'positive' && 'Resultado Positivo') ||
						(result === 'negative' && 'Resultado Negativo') ||
						(!result && 'Esperando Resultados')}
				</p>
				<p className={`${percent >= 70 && 'active'}`}>Proceso de alta</p>
				<p className={`${percent === 100 && 'active'}`}>Finalizado</p>
			</div>
		</div>
	);
};

export default Steper;
