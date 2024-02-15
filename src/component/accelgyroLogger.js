import React, { useEffect, useState } from 'react';

const AccelGyroLogger = ({
  name,
  quizType,
  onAccelgyroData,
  quizSessionType,
  ...props
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const timeStamp = new Date().toISOString();

      const newData = {
        accel_g: {
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y,
          z: event.accelerationIncludingGravity.z,
          t: timeStamp,
        },
        gyro: {
          a: event.rotationRate.alpha,
          b: event.rotationRate.beta,
          g: event.rotationRate.gamma,
          t: timeStamp,
        },
        accel_nog: {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
          t: timeStamp,
        },
      };

      setData(newData);

      // if (quizSessionType === 'QUIZ') {
      //   onAccelgyroData(newData);
      // } else {
      //   onAccelgyroData((prevData) => prevData.concat(newData));
      // }

      // console.log(setData)
      console.log(newData)
    };

    if (window.DeviceMotionEvent) {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleDeviceMotion, true);
              setPermissionGranted(true);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion, true);
        setPermissionGranted(true);
      }
    } else {
      console.log('DeviceMotionEvent is not supported');
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleDeviceMotion, true);
      }
    };
  }, []);

  return <div name={name} {...props}></div>;
};

export default AccelGyroLogger;