import React from 'react';
import { FaCarSide } from 'react-icons/fa'
import marker from '../../assets/markers/no_users.svg';
import '../../styles/global/Marker.scss';
 
function Marker({
	callback = () => { },
	text = '',
	type = ''
}) 
{
	return (
		<div className='mapMarker' onClick={callback}>
			{text &&
				<div className='mapMarker__container'>
					<p className='mapMarker__container--text'>{text}</p>
				</div>
			}
			<div className='mapMarker__container'>
				<span className='mapMarker__container--icon'>
					{type === 'remis' ? <FaCarSide /> : <img src={marker} />}
				</span>
			</div>
		</div>
	);
}

export default Marker;
