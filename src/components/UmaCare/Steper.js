import React from 'react';
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from 'react-icons/io';
import { ProgressBar, Step } from 'react-step-progress-bar';

const Steper = ({ porcentaje, color, actual }) => {
	const returnIcon = (accomplished) => {
		if (accomplished) {
			return <IoIosRadioButtonOn />;
		} else {
			return <IoIosRadioButtonOff />;
		}
	};

	return (
		<div className={`calamardotentaculos ${color ? color : 'gris'}`}>
			<h5>Estado Actual</h5>
			<div className='progressbar'>
				<ProgressBar percent={porcentaje}>
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
				<p className={`${porcentaje >= 0 && 'active'}`}>Hisopado</p>
				<p className={`${porcentaje >= 35 && 'active'}`}>
					{(actual.resultado === 'positive' && 'Resultado Positivo') ||
						(actual.resultado === 'negative' && 'Resultado Negativo') ||
						(!actual.resultado && 'Esperando Resultados')}
				</p>
				<p className={`${porcentaje >= 70 && 'active'}`}>Proceso de alta</p>
				<p className={`${porcentaje === 100 && 'active'}`}>Finalizado</p>
			</div>
		</div>
	);
};

export default Steper;
