import React, { useEffect, useState } from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from 'react-icons/io';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

function DeliveryProgressBar({ progress = [] }) {
	const [currentProgress, setCurrentProgress] = useState([]);
	const [currentStep, setCurrentStep] = useState(null);
	const [percent, setPercent] = useState(0);
	const [progressMode, setProgressMode] = useState(false);

	useEffect(() => {
		let firstTrue = progress.findIndex(item => item.active === true);
		let startArr = 0;
		let endArr = 7;
		switch(firstTrue) {
			case 0 : 
				setPercent(8);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 1 : 
				setPercent(23);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 2 : 
				setPercent(37);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 3 : 
				setPercent(50);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 4 : 
				setPercent(62);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 5 : 
				setPercent(77);
				setCurrentStep(progress[firstTrue].text);
				break;
			case 6 : 
				setPercent(100);
				setCurrentStep(progress[firstTrue].text);
				break;
			default:
				break;
		}
		let newArr = progress.slice(startArr, endArr);
		setCurrentProgress(newArr);
	}, [progress])

	const returnIcon = (active) => {
		if (active) {
			return <IoIosRadioButtonOn />;
		} else {
			return <IoIosRadioButtonOff />;
		}
	};

	return (
		<div className={`trackProgress__container--percent p${percent}`}>
			{!progressMode ? (<>
				<FaChevronDown className="trackProgress__container--chevron" onClick={() => setProgressMode(!progressMode)} />
				<p className="trackProgress__container--current">{currentStep}</p>
			</>) : (<>
				<FaChevronUp className="trackProgress__container--chevron" onClick={() => setProgressMode(!progressMode)} />
				<ProgressBar filledBackground='#97c1d3' percent={percent} className={`p${percent}`}>
				{currentProgress.map((item) => (
						<Step key={item.text} transition='scale'>
							{() => (
								<div className="trackProgress__container--item">
									<div className={`trackProgress__container--step ${item.active ? 'active' : ''}`}>
										{returnIcon(item.active)}
									</div>
									<span className='trackProgress__container--text'>{item.text}</span>
								</div>
							)}
						</Step>
					))}
				</ProgressBar>
			</>)}
		</div>
	);
}

export default DeliveryProgressBar; 