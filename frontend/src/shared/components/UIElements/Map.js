import React, { useRef, useEffect } from "react";

import "./Map.css";

/*
 * [Card] component is used to display user and property card in list
 */

const Map = (props) => {
  const mapRef = useRef();                                            //reference to add to the div

  const { center, zoom } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {            //The actual map window
        center: center,
        zoom: zoom
      });
    
    new window.google.maps.Marker({ position: center, map: map }); //Marker on the map
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
