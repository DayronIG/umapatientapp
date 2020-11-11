import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BackButton } from '../../GeneralComponents/Headers';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded } from '../../Utils/mapsApiHandlers';
import { IoMdArrowRoundBack } from 'react-icons/io'
import '../../../styles/hisopado/coverage.scss';

const HisopadosCoverage = () => {
    const history = useHistory();
    const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
    const allCoords = useSelector(state => state.deliveryService.coverage)
    const { ws } = useSelector(state => state.queries.patient)

    const onGoogleApiLoaded = async (map, maps) => {
        handleApiLoaded(setUserLocation);
      
        let coverage = new maps.Polygon({
          paths: allCoords,
          strokeColor: "#009042",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#009042",
          fillOpacity: 0.35
        });
        coverage.setMap(map);
      };
    
    return (
        <div className="coverage__container">
             <BackButton inlineButton={true} customTarget={ws} action={()=>history.push(`/hisopado/${ws}`)} />
            <div className="coverage__map">
                {/* <button className="coverage__back" onClick={()=> history.push(`/hisopado/${ws}`)}>
                    <IoMdArrowRoundBack />
                </button> */}
                <GoogleMapReact 
                    {...mapConfig({lat: -34.663069, lng: -58.424647 }, () => {}, 11)}
                    onGoogleApiLoaded={({ map, maps }) => onGoogleApiLoaded(map, maps)}
                />
                <article className="coverage__card">
                    <h2 className="coverage__cardTitle">Áreas de cobertura</h2>
                    <ul className="coverage__cardList">
                        <li className="coverage__cardItem coverage__cardItem-con">
                            <span></span>
                            Con cobertura
                        </li>
                        <li className="coverage__cardItem coverage__cardItem-sin">
                            <span></span>
                            Sin cobertura
                        </li>
                    </ul>
                </article>
            </div>
        </div>
    )    
}

export default HisopadosCoverage;