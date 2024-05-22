import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import "agora-chat-uikit/style.css";
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
import { AgoraProvider } from "../../context/agora-context";

const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY_NOT_AUTH;
const chatId = process.env.REACT_APP_AGORA_CHAT_APP_ID_KEY;

const AgoraManager = ({ config, children }) => {
  // const { isLoading, isSuccess, isError, token, error } = useFetchChannelToken(
  //   config.uid,
  //   config.channelName
  // );

  // const { isSuccess: isSuccessFetchChatToken, token: chatToken } =
  //   useFetchChatToken(config.uid);

  const agoraEngine = useRTCClient();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: appId,
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
      <Box
        component="div"
        display="flex"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={4}
      >
        <Stack spacing={2}>
          <Box display="flex" justifyContent="center">
            <CircularProgress value={40} />
          </Box>
          <Typography variant="h5" component="h5">
            채널에 입장중입니다...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <AgoraProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          height: "90%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "320px", lg: "500px" },
            height: { xs: "320px", lg: "410px" },
            margin: "4px 12px",
          }}
        >
          <LocalVideoTrack track={localCameraTrack} play={true} />
        </Box>
        {remoteUsers.map((user) => (
          <Box
            key={user.uid}
            sx={{
              width: { xs: "320px", lg: "500px" },
              height: { xs: "320px", lg: "410px" },
              margin: "4px 12px",
            }}
          >
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "20%",
        }}
      >
        {children}
      </Box>
    </AgoraProvider>
  );
};

export default AgoraManager;
