import { createContext } from "react";

export const AgoraContext = createContext(null);

export const AgoraProvider = ({
  localCameraTrack,
  localMicrophoneTrack,
  children,
}) => (
  <AgoraContext.Provider
    value={{ localCameraTrack, localMicrophoneTrack, children }}
  >
    {children}
  </AgoraContext.Provider>
);
