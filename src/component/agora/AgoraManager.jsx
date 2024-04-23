import { CircularProgress } from "@mui/material";
import {
  LocalVideoTrack,
  RemoteUser,
  useClientEvent,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { AgoraProvider } from "../../context/agora-context";

const AgoraManager = ({ config, children }) => {
  const agoraEngine = useRTCClient();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: config.appId,
    uid: config.uid,
    channel: config.channelName,
    token: null,
  });

  useClientEvent(agoraEngine, "user-joined", (user) => {
    console.log("The user", user.uid, " has joined the channel");
  });

  useClientEvent(agoraEngine, "user-left", (user) => {
    console.log("The user", user.uid, " has left the channel");
    console.log(user);
  });

  useClientEvent(agoraEngine, "user-published", (user, mediaType) => {
    console.log("The user", user.uid, " has published media in the channel");
    console.log(user);
  });

  useEffect(() => {
    return () => {
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, []);

  // Check if devices are still loading
  const deviceLoading =
    isLoadingMic || isLoadingCam || !localCameraTrack || !localMicrophoneTrack;

  if (deviceLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <AgoraProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      <VideoContainer>
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          style={{
            width: "680px",
            height: "510px",
            margin: "10px auto",
          }}
        />
        {remoteUsers.map((user) => (
          <RemoteUser
            user={user}
            style={{
              width: "680px",
              height: "510px",
              margin: "10px auto",
            }}
          />
        ))}
      </VideoContainer>
      <ToolBarContainer>{children}</ToolBarContainer>
    </AgoraProvider>
  );
};

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border: 1px solid red;
`;

const LoadingContainer = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  height: 100vh;
`;

const ToolBarContainer = styled.div`
  position: fixed;
  bottom: 0;

  display: flex;
  justify-content: center;

  width: 100%;
  padding: 12px;
`;

export default AgoraManager;
