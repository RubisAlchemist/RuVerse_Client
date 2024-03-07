import React, { useState, useEffect, useRef, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import EyetrackingContext from "./eyetrackingContext";
import videocallImage from "../images/videocallImage.png";
import styled from "styled-components";
import { Button } from "@mui/material";

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
  const [remoteUsers, setRemoteUsers] = useState([]);

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
      setRemoteUsers((prevUsers) => [...prevUsers, user]);
    });

    client.current.on("user-unpublished", async (user, mediaType) => {
      if (mediaType === "video") {
        document.getElementById(`user-container-${user.uid}`)?.remove();
      }
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    });

    client.current.on("user-left", (user) => {
      document.getElementById(`user-container-${user.uid}`)?.remove();
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    });
  };

  const handleJoin = async () => {
    if (!client.current) return;
    console.log("taehwi");
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
    // Check if the element exists before trying to manipulate it
    const remoteContainer = document.getElementById("remote-container");
    if (remoteContainer) {
      remoteContainer.innerHTML = "";
    }
  };

  const renderLocalUser = () => {
    if (joinState && localVideoTrack) {
      // Ensure the local player container is ready
      setTimeout(() => localVideoTrack.play("local-player"), 0);
      return (
        <div
          id="local-player"
          style={{
            width: "640px",
            height: "480px",
            margin: "auto", // This centers the video in its container
          }}
        ></div>
      );
    }
    return null;
  };

  // Function to render the remote users' videos
  const renderRemoteUsers = () => {
    return remoteUsers.map((user, index) => (
      <div
        key={user.uid}
        id={`user-container-${user.uid}`}
        style={{ width: "320px", height: "240px" }}
      />
    ));
  };
  const getVideoLayout = () => {
    // Check if there are remote users to display the grid layout
    if (remoteUsers.length > 0) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "10px",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {/* Local video */}
          <div id="local-player" style={{ gridColumn: "1" }}>
            {renderLocalUser()}
          </div>

          {/* Assuming only one remote user for this scenario */}
          {remoteUsers.slice(0, 1).map((user) => (
            <div
              key={user.uid}
              id={`user-container-${user.uid}`}
              style={{ gridColumn: "2" }}
            >
              {/* Placeholder for remote video */}
            </div>
          ))}
        </div>
      );
    } else {
      // If no remote users, display only the local video in the center
      return renderLocalUser();
    }
  };

  // 사용자가 참여하지 않았을 때 표시할 요소들을 렌더링하는 함수
  const renderJoinForm = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div>
          <StyledInput
            type="text"
            placeholder="주어진 상담소 이름을 입력하세요"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <StyledInput
            type="text"
            placeholder="당신의 이름을 입력하세요"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            style={{ marginRight: 0 }} // Remove the margin for the second input
          />
        </div>
        <StyledImg src={videocallImage} />
        <Button
          onClick={handleJoin}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          상담 시작하기
        </Button>
      </div>
    );
  };

  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!joinState && renderJoinForm()}
      {joinState && (
        <div style={{ width: "100%" }}>
          {getVideoLayout()}
          <Button
            onClick={handleLeave}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            상담 끝내기
          </Button>
        </div>
      )}
      {/* If you need to render the gaze circle, it should be placed here */}
      {/* {isWebgazerInitialized && <div style={gazeCircleStyle}></div>} */}
    </div>
  );
}

const StyledImg = styled.img`
  width: 60%;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 80vw; // On smaller screens, the image will take up 80% of the viewport width
  }
`;

const StyledInput = styled.input`
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid #008080; // Use the color that your Button uses
  border-radius: 4px;
  width: 200px;
  margin-right: 10px; // Only for the first input
`;
