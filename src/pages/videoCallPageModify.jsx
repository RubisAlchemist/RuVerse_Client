/**
 * agora hook 사용하기위해 필요한 import
 * @AgoraRTCProvider
 * @AtoraTRC
 */
import { Button } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { createChannel, createClient } from "agora-rtm-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unSetCall } from "../store/channel/channelSlice";

import JoinForm from "../component/JoinForm";
import ShowVideo from "../component/ShowVideo";
import VideoRecorder from "../component/videoRecorder";

const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY; // .env 파일 또는 환경 변수에서 Agora App ID

function VideoCallPage({ reduxData }) {
  /**
   * RTCClienet 초기화
   */
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  /**
   * redux state
   */
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channel);

  /** create RTMClient hook */
  const [rtmClient, setRtmClient] = useState(null);
  const [rtmChannel, setRtmChannel] = useState(null);

  const videoRecorderRef = useRef();

  /**
   * 전파된 endSession 메세지 리스너 실행
   */
  useEffect(() => {
    if (rtmChannel) {
      rtmChannel.on("ChannelMessage", ({ text }, senderId) => {
        console.log(`message Listener = ${text}`);
        if (text === "endSession") {
          stopRecording();
          dispatch(unSetCall());
        }
      });
    }

    async function stopRecording(params) {
      await videoRecorderRef.current?.stopAndDownloadRecording();
    }
  }, [dispatch, rtmChannel]);

  /**
   * 채널 입장
   * 1. RTM 클라이언트 로그인
   * 2. 채널 입장
   * 3. 메시지 리스너 설정
   * 4. JoinState 변경
   */
  const handleJoin = async () => {
    // RTM 로그인 및 채널 조인
    // 사용자 입력에 기반하여 RTM 클라이언트 설정 및 채널 조인
    const tempclient = createClient(appId);
    const tempchannel = createChannel(channel.name);

    setRtmClient(tempclient);
    setRtmChannel(tempchannel);

    const testClient = tempclient();
    const testChannel = tempchannel(testClient);

    // RTM 로그인 및 채널 조인
    await testClient.login({ uid: channel.uid });
    await testChannel.join();

    //
    console.log(videoRecorderRef);
    if (videoRecorderRef.current) {
      console.log("레코딩 1");
      videoRecorderRef.current.startRecording(); // 녹화 시작
    }
  };

  /**
   * 채널 나가기
   */
  const handleLeave = async () => {
    // 채널 종료 메세지 전파
    try {
      await rtmChannel.sendMessage({ text: "endSession" });
      console.log("send message success");
    } catch (err) {
      console.log("send message failed");
      console.log(err);
    }

    if (videoRecorderRef.current) {
      console.log("레코딩 2");
      await videoRecorderRef.current.stopAndDownloadRecording(); // 녹화 중지 및 다운로드
    }

    // RTM 클라이언트 로그아웃 및 채널 나가기
    await rtmChannel.leave();
    await rtmClient.logout();

    dispatch(unSetCall());
  };

  /**
   * 연결 전 폼 랜더링
   */
  if (!channel.call) {
    return <JoinForm handleJoin={handleJoin} />;
  }

  /**
   * 연결 이후
   */
  return (
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
      <AgoraRTCProvider client={client}>
        <div
          id="video-container"
          style={{ width: "100%", marginTop: "-50px", marginBottom: "80px" }}
        >
          <ShowVideo />
        </div>
        <div id="button-container" style={{ marginTop: "80px" }}>
          {" "}
          {/* Push the button to the bottom */}
          <Button onClick={handleLeave} variant="contained" color="primary">
            상담 끝내기
          </Button>
        </div>
      </AgoraRTCProvider>
      <VideoRecorder
        ref={videoRecorderRef}
        reduxData={reduxData}
        style={{ display: channel.call ? "block" : "none" }}
      />
    </div>
  );
}

export default VideoCallPage;
