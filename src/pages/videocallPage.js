import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function VideocallPage() {
  //   const { RtcTokenBuilder, RtcRole } = require("agora-token");

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
    // Create Agora client
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }, []);

  const handleJoin = async () => {
    // Join the channel with the user provided channel name and uid
    await client.current.join(appId, channelName, null, uid || null);

    // Create and publish the local video and audio tracks
    const videoTrack = await AgoraRTC.createCameraVideoTrack();
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    await client.current.publish([videoTrack, audioTrack]);

    // Set the local video track to be rendered in the local video component
    setLocalVideoTrack(videoTrack);
    setLocalAudioTrack(audioTrack);

    setJoinState(true);
  };

  const handleLeave = async () => {
    // Destroy the local audio and video tracks.
    localVideoTrack?.close();
    localAudioTrack?.close();

    // Leave the channel.
    await client.current.leave();

    setJoinState(false);
    setLocalVideoTrack(null);
    setLocalAudioTrack(null);
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
      {/* Render local video track */}
      {localVideoTrack && (
        <div
          id="local_video"
          style={{ width: "320px", height: "240px" }}
          ref={(ref) => {
            // Play the local video track
            localVideoTrack.play(ref);
          }}
        />
      )}
    </div>
  );
}
