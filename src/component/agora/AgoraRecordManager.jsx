import { Box } from "@mui/material";
import { RemoteUser, useJoin, useRemoteUsers } from "agora-rtc-react";
import React from "react";

/**
 * Agora Cloud Recording 요청 시에
 * 녹화 환경
 */
const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY_NOT_AUTH;

const AgoraRecordManager = ({ config }) => {
  const remoteUsers = useRemoteUsers();

  useJoin(
    {
      appid: appId,
      uid: config.uid,
      channel: config.cname,
      token: null,
    },
    true
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
      }}
    >
      {/* 내 화면 */}
      {remoteUsers
        .filter((user) => user.uid !== config.localUid)
        .map((user) => (
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
      {/* 상대방 화면 */}
      {remoteUsers
        .filter((user) => user.uid === config.localUid)
        .filter((user) => user.hasVideo)
        .map((user) => (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "black",
              width: { xs: "35%", lg: "25%" },
              height: { xs: "20%", md: "25%", lg: "30%" },
            }}
          >
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
    </Box>
  );
};

export default AgoraRecordManager;
