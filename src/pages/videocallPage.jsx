import { Box } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AgoraManager from "../component/agora/AgoraManager.jsx";
import VirtualBackground from "../component/agora/VirtualBackground.jsx";
import ChannelLeave from "../component/channel/ChannelLeave.jsx";
import UploadToS3Modal from "../component/channel/UploadToS3Modal.jsx";
import JoinForm from "../component/form/JoinForm.jsx";
import { StylusLogger, TouchLogger } from "../component/logger/index.js";
import RecordManager from "../component/record/RecordManager.jsx";
// import AgoraRtmManager from "../component/agora/AgoraRtmManager.jsx";

const VideoCallPage = () => {
  const call = useSelector((state) => state.channel.call);
  const channelName = useSelector((state) => state.channel.name.value);
  const uid = useSelector((state) => state.channel.uid.value);

  const config = {
    channelName,
    uid,
  };

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  if (!call) {
    return (
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <JoinForm />
      </Box>
    );
  }
  /**
   * 화상 통화 중에만 Touch, Stylus 데이터 수집
   * 채널 나갈 경우 초기화
   */
  return (
    <TouchLogger>
      <StylusLogger>
        <AgoraRTCProvider client={client}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid blue",
            }}
          >
            <AgoraManager config={config}>
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  bgcolor: "ButtonShadow",
                  padding: "12px",
                }}
              >
                <ChannelLeave />
                <RecordManager>
                  <UploadToS3Modal />
                </RecordManager>
                {/* <VirtualBackground /> */}
              </Box>
            </AgoraManager>
          </Box>
          {/* <AgoraRtmManager config={config} /> */}
        </AgoraRTCProvider>
      </StylusLogger>
    </TouchLogger>
  );
};

export default VideoCallPage;
