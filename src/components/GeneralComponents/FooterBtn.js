import React from 'react';
import '../../styles/generalcomponents/FooterBtn.scss';

const FooterBtn = ({
	callback = () => console.log('empty'),
	mode = 'single',
	text = 'temporary text',
	color = 'footer-primary',
	type = 'button',
}) => {
	const renderBtn = () => {
		// This is to do a map of buttons that could be in the bottom, still in progress...
		switch (mode) {
			case 'single':
				return (
					<button type={type} className={`customFooterBtn__container--btn ${color}`} onClick={callback}>
						{text}
					</button>
				);
			case 'multi':
				return (
					<>
						{text.map((txtBtn, index) => (
							<button
								className={
									color
										? `customFooterBtn__container--btn ${color[index]} ${index > 0 ? 'ml-2' : ''}`
										: `customFooterBtn__container--btn footer-primary ${index > 0 ? 'ml-2' : ''}`
								}
								key={index}
								onClick={() => callback[index]()}>
								{txtBtn}
							</button>
						))}
					</>
				);
			// if no mode is passed, single is default
			default:
				return (
					<button
						className={
							color
								? `customFooterBtn__container--btn ${color}`
								: 'customFooterBtn__container--btn footer-primary'
						}
						onClick={() => callback()}>
						{text}
					</button>
				);
		}
	};

	return (
		<footer className={color ? `customFooterBtn ${color}` : `customFooterBtn`}>
			<div className='customFooterBtn__container'>{renderBtn()}</div>
		</footer>
	);
};

export default FooterBtn;
