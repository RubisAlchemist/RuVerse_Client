import { Box, Typography } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import React, { useMemo, useState } from "react";
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
  const [isError, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cname: cnameBase64, uid: uidBase64 } = useParams();

  const config = useMemo(() => {
    // cname 정규식
    const cnameRegex = /^[a-zA-Z0-9]+$/;
    // uid 정규식
    const uidRegex = /^[0-9]+$/;

    try {
      // cname base64 decode
      const cname = window.atob(cnameBase64);
      // uid base64 decode
      const uid = window.atob(uidBase64);

      // 복호화한 값들이 정규식과 일치하지 않을 경우 Error
      if (!cnameRegex.test(cname) || !uidRegex.test(uid)) {
        setError(true);
        return null;
      }

      setError(false);
      return {
        cname,
        uid,
      };
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, [cnameBase64, uidBase64]);

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

  if (isError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h2">유효하지 않은 채널입니다.</Typography>
      </Box>
    );
  }

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
