import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AgoraManager from "../component/agora/AgoraManager.jsx";
import VirtualBackground from "../component/agora/VirtualBackground.jsx";
import ChannelJoin from "../component/channel/ChannelJoin.jsx";
import ChannelLeave from "../component/channel/ChannelLeave.jsx";
import UploadToS3Modal from "../component/channel/UploadToS3Modal.jsx";
import JoinForm from "../component/form/JoinForm.jsx";
import { StylusLogger, TouchLogger } from "../component/logger/index.js";
import RecordManager from "../component/record/RecordManager.jsx";

const VideoCallPage = () => {
  const call = useSelector((state) => state.channel.call);
  const channelName = useSelector((state) => state.channel.name);
  const uid = useSelector((state) => state.channel.uid);
  const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY;

  const config = {
    appId,
    channelName,
    uid,
  };

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  if (!call) {
    return (
      <FormContainer>
        <JoinForm />
        <ChannelJoin />
      </FormContainer>
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
          <VideoPageContainer>
            <AgoraManager config={config}>
              <ToolBarButtonContainer>
                <ChannelLeave />
                <RecordManager>
                  <UploadToS3Modal />
                </RecordManager>
                <VirtualBackground />
              </ToolBarButtonContainer>
            </AgoraManager>
          </VideoPageContainer>
        </AgoraRTCProvider>
      </StylusLogger>
    </TouchLogger>
  );
};

export default VideoCallPage;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
`;

const VideoPageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
`;

const ToolBarButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 50%;
`;
