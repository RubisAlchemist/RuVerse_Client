import React, { useMemo, useState } from "react";
import {
  CameraAlt,
  LocationOn,
  Mic,
  NavigationRounded,
} from "@mui/icons-material";
const useDevicePermission = () => {
  const [permissions, setPermissions] = useState([
    {
      key: "camera",
      icon: <CameraAlt />,
      name: "카메라",
      isPermitted: false,
      loading: false,
    },
    {
      key: "location",
      icon: <LocationOn />,
      name: "GPS",
      isPermitted: false,
      loading: false,
    },
    {
      key: "microphone",
      icon: <Mic />,
      name: "마이크",
      isPermitted: false,
      loading: false,
    },
  ]);

  const isAllPermissionsGranted = useMemo(
    () => permissions.every((permission) => permission.isPermitted),
    [permissions]
  );

  const handlePermissions = async (key) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === key ? { ...permission, loading: true } : permission
      )
    );
    switch (key) {
      case "camera":
        await handleCameraPermission();
        break;
      case "microphone":
        await handleMicrophonePermission();
        break;
      case "location":
        handleGpsPermission();
        break;

      default:
        break;
    }
  };

  /**
   * 카메라 권한
   */
  const handleCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (permissionStatus.active) {
        console.log("허용");
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission.key === "camera"
              ? { ...permission, isPermitted: true, loading: false }
              : permission
          )
        );
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  /**
   * 마이크 권한
   */
  const handleMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (permissionStatus.active) {
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission.key === "microphone"
              ? { ...permission, isPermitted: true, loading: false }
              : permission
          )
        );
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  /**
   * GPS 권한
   */

  const handleSuccess = () => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === "location"
          ? { ...permission, isPermitted: true, loading: false }
          : permission
      )
    );
  };

  const handleError = (err) => {
    console.log(err);
  };
  const handleGpsPermission = () => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {});
  };

  return { permissions, handlePermissions, isAllPermissionsGranted };
};

export default useDevicePermission;
