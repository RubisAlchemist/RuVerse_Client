// GPSLogger.js
import React, { useEffect, useRef } from 'react';

const GPSLogger = ({
  name,
  onGpsData,
  quizType,
  gpsData,
  quizSessionType,
  ...props
}) => {
  const positionsRef = useRef([]);

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 100,
  };

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      function(position) {
        const newPosition = {
          timeStamp: new Date().toISOString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
        };

        positionsRef.current = [...positionsRef.current, newPosition];

        // Call the onGpsData function with the new position
        // onGpsData(newPosition);

        console.log("Latitude: ", position.coords.latitude);
        console.log("Longitude: ", position.coords.longitude);
        console.log("Altitude: ", position.coords.altitude);
        console.log(position);
        console.log(newPosition.timeStamp);
      },
      error,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(id);

      // When component is unmounted, print all positions
      // console.log(positionsRef.current);
    };
  }, []);

  return <div name={name} {...props}></div>;
};

export default GPSLogger;