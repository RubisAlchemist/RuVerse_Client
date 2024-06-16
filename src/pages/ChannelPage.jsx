import { Box } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AgoraManager from "../component/agora/AgoraManager";
import VirtualBackground from "../component/agora/VirtualBackground";
import ChannelLeave from "../component/channel/ChannelLeave";
import UploadToS3Modal from "../component/channel/UploadToS3Modal";
import { StylusLogger, TouchLogger } from "../component/logger";
import RecordManager from "../component/record/RecordManager";

import { useDispatch } from "react-redux";
import webgazer from "webgazer";
import { resetLogger } from "../store/logger/loggerSlice";
import { resetUpload } from "../store/upload/uploadSlice";
const ChannelPage = () => {
  const dispatch = useDispatch();
  const { cname, uid } = useParams();

  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      cname,
      uid,
    }),
    [cname, uid]
  );
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  /**
   * 채널 나가기
   * 로거, 업로드 스토어 초기화
   */
  const handleLeave = () => {
    webgazer.end();

    dispatch(resetLogger());
    dispatch(resetUpload());
    navigate("/channelEntry", { replace: true });
  };

  return (
    <TouchLogger>
      <StylusLogger>
        <AgoraRTCProvider client={client}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
            }}
          >
            <AgoraManager config={config}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  bgcolor: "ButtonShadow",
                  padding: "12px",
                }}
              >
                <ChannelLeave onClick={handleLeave} />
                <RecordManager>
                  <UploadToS3Modal />
                </RecordManager>
                <VirtualBackground />
              </Box>
            </AgoraManager>
          </Box>
        </AgoraRTCProvider>
      </StylusLogger>
    </TouchLogger>
  );
};

export default ChannelPage;
