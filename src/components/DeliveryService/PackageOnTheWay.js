import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { errorHandler, currentPositionHandler } from '../Utils/mapsApiHandlers';

const PackageOnTheWay = ({ providerPos }) => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const handleApiLoaded = () => {
		if (!navigator.geolocation) return null;
		navigator.geolocation.getCurrentPosition((pos) => setUserLocation(currentPositionHandler(pos)), errorHandler);
	};

	return (
		<GoogleMapReact
			bootstrapURLKeys={{
				key: 'AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs',
				libraries: ['places'],
			}}
			yesIWantToUseGoogleMapApiInternals
			center={{ lat: userLocation.lat, lng: userLocation.lng }}
			zoom={15}
			options={{
				streetViewControl: false,
				disableDefaultUI: false,
				mapTypeControl: false,
				styles: [
					{
						featureType: 'poi',
						elementType: 'labels',
						stylers: [{ visibility: 'on' }],
					},
				],
			}}
			onGoogleApiLoaded={handleApiLoaded}>
			<FontAwesomeIcon
				className='trackProgress__container--marker'
				lat={providerPos.lat}
				lng={providerPos.lng}
				{...userLocation}
				icon={faMapMarkerAlt}
			/>
			<FontAwesomeIcon className='trackProgress__container--marker' {...userLocation} icon={faMapMarkerAlt} />
		</GoogleMapReact>
	);
};

export default PackageOnTheWay;
