import React from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";
import geocoder from "geocoder";
import Geocode from "react-geocode";
import customMarker from "../../assets/cross.svg";
import customMarker2 from "../../assets/map-marker.svg";

export const basesAmbulancias = [
  { name: "Adrogue", lat: -34.8027596, lng: -58.4067156 },
  { name: "Newbery", lat: -34.557739, lng: -58.416998 },
  { name: "Balvanera", lat: -34.607646, lng: -58.41244 },
  { name: "Base Casino", lat: -34.623226, lng: -58.360892 },
  { name: "Base Ciudad", lat: -34.544415, lng: -58.459645 },
  { name: "Aeropuerto Ezeiza", lat: -34.814934, lng: -58.534796 },
  { name: "San Martin", lat: -34.577026, lng: -58.53894 },
  { name: "Caballito", lat: -34.6059529, lng: -58.4433488 },
  { name: "Caseros", lat: -34.6099084, lng: -58.5657768 },
  { name: "Castelar", lat: -34.6537204, lng: -58.6452386 },
  { name: "Chacabuco", lat: -34.6317583, lng: -58.4308142 },
  { name: "City", lat: -34.5100914, lng: -58.5305353 },
  { name: "Coghlan", lat: -34.5631905, lng: -58.4758866 },
  { name: "Cume", lat: -34.5721882, lng: -58.4544952 },
  { name: "San Cristobal", lat: -34.627852, lng: -58.4067085 },
  { name: "Constitución", lat: -34.6222311, lng: -58.3884935 },
  { name: "Mataderos", lat: -34.6558719, lng: -58.4997894 },
  { name: "Palermo", lat: -34.5836088, lng: -58.4068906 },
  { name: "Varela", lat: -34.7327776, lng: -58.2969098 },
  { name: "Laferrere", lat: -34.7517, lng: -58.588461 },
  { name: "Lanus", lat: -34.6939045, lng: -58.3926775 },
  { name: "Lomas de Zamora", lat: -34.754984, lng: -58.3985626 },
  { name: "Monte Grande", lat: -34.8176698, lng: -58.4706932 },
  { name: "Moreno", lat: -34.644799, lng: -58.795831 },
  { name: "Morón", lat: -34.6669496, lng: -58.6038917 },
  { name: "Olivos", lat: -34.5021375, lng: -58.4971357 },
  { name: "Pacheco", lat: -34.4712874, lng: -58.6566699 },
  { name: "Victoria", lat: -34.4553699, lng: -58.5436952 },
  { name: "Sarandi", lat: -34.6809343, lng: -58.3473557 },
  { name: "Ramos Mejia", lat: -34.6479103, lng: -58.5660234 },
  { name: "San Miguel", lat: -34.5350667, lng: -58.7242736 }
];

const AmbulanceMap = props => {
  const key = () => {
    Geocode.setApiKey("AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs");
    Geocode.setLanguage("es");
    Geocode.setRegion("ar");
    Geocode.enableDebug();
  };

  const searchAddress = address => {
    geocoder.geocode(address, (err, data) => {
      console.log(err);
      // console.log(data);
    });
  };

  return (
    <>
      <GoogleMap
        defaultZoom={13.7}
        defaultCenter={{ lat: -34.6037, lng: -58.3816 }}
        center={{ lat: props.coords.lat, lng: props.coords.lng }}
      >
        {basesAmbulancias.map((marker, index) => (
          <Marker
            icon={customMarker}
            position={{ lat: marker.lat, lng: marker.lng }}
            key={index}
          />
        ))}
        <Marker
          position={{ lat: props.coords.lat, lng: props.coords.lng }}
          icon={customMarker2}
        />
      </GoogleMap>
    </>
  );
};

export default withScriptjs(withGoogleMap(AmbulanceMap));
