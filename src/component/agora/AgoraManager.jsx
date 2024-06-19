import { Box, CircularProgress, Stack, Typography } from "@mui/material";
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
import useFetchChannelToken from "../../hooks/useFetchChannelToken";

const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY_NOT_AUTH;

const AgoraManager = ({ config, children }) => {
  // 서버에서 auth token 불러오기
  // const {
  //   isLoading,
  //   isSuccess: fetchTokenSuccess,
  //   isError: tokenFetchError,
  //   token,
  // } = useFetchChannelToken(config.uid, config.cname);

  const agoraEngine = useRTCClient();
  // 로컬 사용자 카메라 트랙
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  // 로컬 사용자 마이크 트랙
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();

  // 채널에 연결된 상대방들
  const remoteUsers = useRemoteUsers();

  // 로컬 사용자 비디오, 마이크 상대방에게 전달하기
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // 채널에 입장하는 훅
  useJoin(
    {
      appid: appId,
      uid: config.uid,
      channel: config.cname,
      token: null, // 토큰을 사용하지 않을 경우 null
    },
    // fetchTokenSuccess // 토큰 불러오기 성공한 뒤 join
    true
  );

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
      // 채널에서 나갈때 카메라, 마이크 트랙 닫기
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
        }}
      >
        {remoteUsers.map((user) => (
          <Box
            key={user.uid}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: 0,
            background: "black",
            width: { xs: "35%", lg: "25%" },
            height: { xs: "20%", md: "25%", lg: "30%" },
          }}
        >
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            autoPlay={true}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "10%",
        }}
      >
        {children}
      </Box>
    </AgoraProvider>
  );
};

export default AgoraManager;
