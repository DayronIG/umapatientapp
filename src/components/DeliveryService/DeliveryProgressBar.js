import React from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from 'react-icons/io';

export default function DeliveryProgressBar({ progress, percent }) {
	const returnIcon = (accomplished) => {
		if (accomplished) {
			return <IoIosRadioButtonOn />;
		} else {
			return <IoIosRadioButtonOff />;
		}
	};

	return (
		<ProgressBar filledBackground='#97c1d3' percent={percent}>
			{progress.map((item) => (
				<Step transition='scale'>
					{({ accomplished }) => (
						<div className={`trackProgress__container--step ${accomplished ? 'accomplished' : ''}`}>
							{returnIcon(accomplished)}
							<span className='trackProgress__container--text'>{item.text}</span>
						</div>
					)}
				</Step>
			))}
		</ProgressBar>
	);
}
