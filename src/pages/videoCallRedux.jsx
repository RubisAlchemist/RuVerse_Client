/**
 * agora hook 사용하기위해 필요한 import
 * @AgoraRTCProvider
 * @AtoraTRC
 */
import AgoraRTC, {
  AgoraRTCProvider,
  useClientEvent,
  useRTCClient,
} from "agora-rtc-react";

import React from "react";
import styled from "styled-components";
import JoinForm from "../component/JoinForm";

import { useDispatch, useSelector } from "react-redux";
import ShowVideo from "../component/ShowVideo";
import { unSetCall } from "../store/channel/channelSlice";
import { Button } from "@mui/material";

function VideoCallPage() {
  /**
   * RTCClienet 초기화
   */
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const dispatch = useDispatch();

  /**
   * 방 참가자가 나가면 user-left 이벤트가 다른 모든 참가자들에게 전파됨
   * 이 이벤트가 트리거 됐을 경우 방 자동으로 나가게 설정함
   */
  useClientEvent(client, "user-left", (user, d) => {
    dispatch(unSetCall());
  });

  const channel = useSelector((state) => state.channel);

  /**
   * 연결 전 폼 랜더링
   */
  if (!channel.call) {
    return <JoinForm />;
  }

  /**
   * 연결 이후
   */
  return (
    <>
      <AgoraRTCProvider client={client}>
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Ensure elements are stacked vertically
            justifyContent: "center", // Align content to the start of the container
            alignItems: "center", // Center items horizontally
            height: "100vh", // Full viewport height
            width: "100%", // Full viewport width
          }}
        >
          <ShowVideo />
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(unSetCall())}
            style={{ marginBottom: "80px" }}
          >
            상담 끝내기
          </Button>
        </div>
      </AgoraRTCProvider>
    </>
  );
}
export default VideoCallPage;
