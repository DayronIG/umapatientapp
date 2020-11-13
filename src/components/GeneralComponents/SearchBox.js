import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
  
function SearchBoxFunc({ map, mapApi, handleChangePlace, value }){
    const dispatch = useDispatch();
    let searchInput= useRef(null);
    const selector = useSelector(state => state.deliveryService.hisopadoUserAddress);
    const [counter, setCounter] = useState(true)

    useEffect(()=>{
        if(counter && value){
            dispatch({type: 'SET_HISOPADO_USER_ADDRESS', payload: value})
            setCounter(false)
        }
    }, [value])

    const handleAddressChange = (e) => {
       dispatch({type: 'SET_HISOPADO_USER_ADDRESS', payload: e.target.value})
        let searchBox = new mapApi.places.Autocomplete(searchInput);
        searchBox.setFields(['place_id', 'name', 'geometry.location', 'formatted_address', 'address_components']);
        searchBox.bindTo('bounds', map);
        searchBox.addListener('place_changed', function() {
            let place = searchBox.getPlace();
            let latlng = {
                lat: parseFloat(place.geometry?.location.lat()),
                lng: parseFloat(place.geometry?.location.lng())
            }
		    handleChangePlace(place);
            dispatch({type: 'SET_MARKER_INPUT_ADDRESS', payload: latlng})
            // dispatch({type: 'SET_HISOPADO_USER_ADDRESS', payload: user.formatted_address})
        });
    }

    return(
        <input 
            value={selector}
            ref={(ref) => { searchInput = ref; }}
            onChange={(e) => handleAddressChange(e)}
            onClick={() => dispatch({type: 'SET_HISOPADO_USER_ADDRESS', payload:  ""})}
            type='text'
            placeholder="Dirección"
            />
        )
};

export default SearchBoxFunc;