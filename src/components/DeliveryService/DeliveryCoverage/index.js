import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { BackButton, GenericHeader } from '../../GeneralComponents/Headers';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded } from '../../Utils/mapsApiHandlers';
import { IoMdArrowRoundBack } from 'react-icons/io'
import '../../../styles/hisopado/coverage.scss';
import { getDocumentFB } from '../../Utils/firebaseUtils';

const HisopadosCoverage = () => {
    const history = useHistory();
    const { ws } = useParams();
    const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
    const allCoords = useSelector(state => state.deliveryService.coverage)

    const onGoogleApiLoaded = async (map, maps) => {
        handleApiLoaded(setUserLocation);

        let auxiliaryCoords = [];
        let coordsArray = []

        if(!allCoords.length) {
            const params = await getDocumentFB('parametros/userapp/delivery/hisopados')
            Object.keys(params.zones).map(zone => {
                let coordsArrayByZone = []
                params.zones[zone].forEach(coord => {
                    let coordToNumber = {
                        lat: Number(coord.lat),
                        lng: Number(coord.lng)
                    }
                    coordsArrayByZone.push(coordToNumber);
                });
                coordsArray.push(coordsArrayByZone)
        })}

        let coveragesArray = []

        coordsArray.map(arr => {
            let coverage = new maps.Polygon({
                paths: arr,
                strokeColor: "#009042",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#009042",
                fillOpacity: 0.35
              });
              coveragesArray.push(coverage)
        })
      
        coveragesArray.map(cov => cov.setMap(map))
      };
    
    return (
        <div className="coverage__container">
            {
                ws ?
                <BackButton inlineButton={true} customTarget={ws} action={()=>history.push(`/hisopado/${ws}`)} /> :
                <GenericHeader />
            }
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