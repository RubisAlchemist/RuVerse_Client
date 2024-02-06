export const checkPermission = async (permission) => {
  let name = permission;
  switch (permission) {
    case "camera":
    case "microphone":
      break;
    case "location":
    case "geolocation":
      name = "geolocation";
      break;
    case "devicemotion":
    default:
      console.log(`Permission ${permission} not handled.`);
  }
  const query = await navigator.permissions.query({ name });
  // console.log("permission state:", name, query.state);
  return Promise.resolve(query.state === "granted");
};
export const requestPermission = (permission, dispatch) => {
  switch (permission) {
    case "camera":
      navigator.mediaDevices
        .getUserMedia({ video: true })
        // .then(() => dispatch(grantPermission(permission)))
        .catch((error) => console.error("Camera permission denied:", error));
      break;
    case "microphone":
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        // .then(() => dispatch(grantPermission(permission)))
        .catch((error) =>
          console.error("Microphone permission denied:", error)
        );
      break;
    case "location":
      navigator.geolocation.getCurrentPosition(
        // () => dispatch(grantPermission(permission)),
        (error) => console.error("Location permission denied:", error)
      );
      break;
    case "devicemotion":
      // set up a listener for the devicemotion event and handle it when it's triggered
      // window.addEventListener('devicemotion', () => dispatch(grantPermission(permission)), { once: true });
      console.log("requesting devicemotion permission");
      if (window.DeviceMotionEvent) {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
          DeviceMotionEvent.requestPermission()
            // .then(() => dispatch(grantPermission(permission)))
            .catch(console.error);
        }
      }
      break;
    default:
      console.warn(`Permission ${permission} not handled.`);
  }
};
