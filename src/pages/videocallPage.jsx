import { Box, Stack } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AgoraManager from "../component/agora/AgoraManager.jsx";
import ChannelLeave from "../component/channel/ChannelLeave.jsx";
import JoinButton from "../component/channel/JoinButton.jsx";
import UploadToS3Modal from "../component/channel/UploadToS3Modal.jsx";
import JoinForm from "../component/form/JoinForm.jsx";
import { StylusLogger, TouchLogger } from "../component/logger/index.js";
import RecordManager from "../component/record/RecordManager.jsx";
import useCurrentLocation from "../hooks/useCurrentLocation.jsx";
import { setCall, unSetCall } from "../store/channel/channelSlice.js";

import webgazer from "webgazer";
import { resetLogger } from "../store/logger/loggerSlice.js";
import { resetUpload } from "../store/upload/uploadSlice.js";
const VideoCallPage = () => {
  const call = useSelector((state) => state.channel.call);
  const cname = useSelector((state) => state.channel.name.value);
  const uid = useSelector((state) => state.channel.uid.value);

  const config = {
    cname,
    uid,
  };

  const dispatch = useDispatch();

  const { handleGps } = useCurrentLocation();

  const handleJoin = () => {
    // webgazer.begin();
    handleGps();
    dispatch(setCall());
  };

  /**
   * 채널 나가기
   * 로거, 업로드 스토어 초기화
   */
  const handleLeave = () => {
    webgazer.end();

    dispatch(resetLogger());
    dispatch(resetUpload());
    dispatch(unSetCall());
  };

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  if (!call) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          border: "1px solid blue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <JoinForm />
          <JoinButton onClick={handleJoin} />
        </Stack>
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
                <ChannelLeave onClick={handleLeave} />
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
