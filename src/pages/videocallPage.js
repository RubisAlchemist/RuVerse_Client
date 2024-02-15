import React, { useState, useEffect, useRef, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import EyetrackingContext from "./eyetrackingContext";

export default function VideocallPage() {
  //   const { RtcTokenBuilder, RtcRole } = require("agora-token");

  const { gazeData, isWebgazerInitialized } = useContext(EyetrackingContext);

  const gazeCircleStyle = {
    position: "fixed",
    left: `${gazeData.x}px`,
    top: `${gazeData.y}px`,
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "red",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: 9999, // Make sure the circle is above all other elements
  };

  const client = useRef(null);
  const [channelName, setChannelName] = useState("");
  const [uid, setUid] = useState("");
  const [joinState, setJoinState] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY; // .env 파일 또는 환경 변수에서 Agora App ID
  //   const appCertificate = process.env.REACT_APP_AGORA_PRIMARY_CERTIFICATE; // .env 파일 또는 환경 변수에서 Agora 인증서
  //   const role = RtcRole.PUBLISHER; // 역할을 PUBLISHER 또는 SUBSCRIBER로 설정할 수 있습니다.
  //   const expirationTimeInSeconds = 3600; // 토큰의 유효 시간 (초 단위)
  //   const currentTimestamp = Math.floor(Date.now() / 1000);
  //   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  //   // 토큰 생성
  //   const agoraToken = RtcTokenBuilder.buildTokenWithUid(
  //     appId,
  //     appCertificate,
  //     channelName,
  //     uid,
  //     role,
  //     privilegeExpiredTs
  //   );

  useEffect(() => {
    if (isWebgazerInitialized) {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      subscribeToEvents();
      return () => {
        if (localVideoTrack) {
          localVideoTrack.close();
        }
        if (localAudioTrack) {
          localAudioTrack.close();
        }
        client.current && client.current.leave();
      };
    }
  }, [isWebgazerInitialized]);

  const subscribeToEvents = () => {
    client.current.on("user-published", async (user, mediaType) => {
      await client.current.subscribe(user, mediaType);
      if (mediaType === "video") {
        const videoTrack = user.videoTrack;
        const playerContainer = document.createElement("div");
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.style.width = "320px";
        playerContainer.style.height = "240px";
        document.getElementById("remote-container").append(playerContainer);
        videoTrack.play(playerContainer);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });

    client.current.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        document.getElementById(`user-container-${user.uid}`)?.remove();
      }
    });

    client.current.on("user-left", (user) => {
      document.getElementById(`user-container-${user.uid}`)?.remove();
    });
  };

  const handleJoin = async () => {
    if (!client.current) return;
    await client.current.join(appId, channelName, null, uid || null);
    const videoTrack = await AgoraRTC.createCameraVideoTrack();
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.current.publish([videoTrack, audioTrack]);
    setLocalVideoTrack(videoTrack);
    setLocalAudioTrack(audioTrack);
    setJoinState(true);

    videoTrack.play("local-player");
  };

  const handleLeave = async () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    await client.current.leave();
    setJoinState(false);
    setLocalVideoTrack(null);
    setLocalAudioTrack(null);
    document.getElementById("remote-container").innerHTML = "";
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter the channel name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter the user ID (optional)"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
      />
      <button onClick={handleJoin} disabled={joinState}>
        Join
      </button>
      <button onClick={handleLeave} disabled={!joinState}>
        Leave
      </button>
      <div id="local-player" style={{ width: "320px", height: "240px" }}></div>
      <div
        id="remote-container"
        style={{ width: "320px", height: "240px" }}
      ></div>
      {/* <div style={gazeCircleStyle}></div> */}
    </div>
  );
}
