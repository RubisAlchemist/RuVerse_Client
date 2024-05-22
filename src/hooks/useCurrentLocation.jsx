// src/hooks/useCurrentPosition.js

import { useDispatch } from "react-redux";
import { setGps } from "../store/logger/loggerSlice";

const useCurrentLocation = (options = {}) => {
  const dispatch = useDispatch();

  // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (position) => {
    const gpsLogs = {
      timeStamp: new Date().toISOString(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude,
    };

    // console.log("useCurrentLocation success", gpsLogs);
    dispatch(setGps(gpsLogs));
  };

  // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error) => {};

  return {
    handleGps: () =>
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {}),
  };
};

export default useCurrentLocation;
