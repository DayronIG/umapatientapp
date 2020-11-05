/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';

const SearchBox = ({ map, mapApi, handleChangePlace, placeholder }) => {
	const searchInput = useRef();
	const [searchBox, setSearchBox] = useState(null);
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		setSearchBox(new mapApi.places.Autocomplete(searchInput.current));
	}, []);

	useEffect(() => {
		if (searchBox) {
			searchBox.setFields(['place_id', 'name', 'geometry.location', 'formatted_address', 'address_components']);
			searchBox.addListener('place_changed', onPlacesChanged);
			searchBox.bindTo('bounds', map);
			return () => {
				mapApi.event.clearInstanceListeners(searchInput);
			};
		}
	}, [searchBox]);

	const onPlacesChanged = () => {
		const place = searchBox.getPlace();
		handleChangePlace(place);
	};

	return (
		<input
			className='selectDestiny__input--address'
			ref={searchInput}
			value={inputValue}
			type='text'
			onChange={(event) => setInputValue(event.target.value)}
			placeholder={placeholder}
		/>
	);
};

export default SearchBox;
