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

  useEffect(() => {
    renderRemoteUsers();
  }, [remoteUsers]);

  const subscribeToEvents = () => {
    client.current.on("user-published", async (user, mediaType) => {
      await client.current.subscribe(user, mediaType);

      // 새로운 원격 사용자의 video track을 DOM에 추가하기 전에 이미 있는지 확인합니다.
      const existingUserContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (!existingUserContainer && mediaType === "video") {
        const videoTrack = user.videoTrack;
        const playerContainer = document.createElement("div");
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.style.width = "680px";
        playerContainer.style.height = "510px";
        document
          .getElementById("remote-container")
          .appendChild(playerContainer);
        videoTrack.play(playerContainer);
      }

      // 원격 사용자의 오디오 트랙이 있다면 재생합니다.
      if (mediaType === "audio") {
        user.audioTrack.play();
      }

      // 원격 사용자 배열을 업데이트합니다. 중복을 피하기 위해 새로운 유저만 추가합니다.
      setRemoteUsers((prevUsers) => {
        // 이 유저가 이미 있는지 확인합니다.
        if (prevUsers.some((existingUser) => existingUser.uid === user.uid)) {
          return prevUsers; // 이미 있으면 상태를 변경하지 않습니다.
        }
        return [...prevUsers, user]; // 새 유저를 배열에 추가합니다.
      });
    });

    client.current.on("user-unpublished", (user) => {
      // DOM에서 해당 유저의 컨테이너를 제거합니다.
      const userContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (userContainer) {
        userContainer.remove();
      }

      // 상태에서도 해당 유저를 제거합니다.
      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    });

    client.current.on("user-left", (user) => {
      // 위와 동일한 로직을 사용합니다.
      const userContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (userContainer) {
        userContainer.remove();
      }

      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
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
            width: "680px",
            height: "510px",
            margin: "auto", // This centers the video in its container
            marginTop: "100px",
          }}
        ></div>
      );
    }
    return null;
  };

  // Function to render the remote users' videos
  const renderRemoteUsers = () => {
    // remote-container가 존재하는지 확인합니다.
    let remoteContainer = document.getElementById("remote-container");
    if (!remoteContainer) {
      remoteContainer = document.createElement("div");
      remoteContainer.id = "remote-container";
      document.body.appendChild(remoteContainer); // 이 부분은 적절한 위치에 맞게 조정해야 할 수 있습니다.
    }

    // 각 원격 사용자에 대해 비디오 트랙을 재생하는 코드를 추가합니다.
    remoteUsers.forEach((user) => {
      const userContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (userContainer && user.videoTrack) {
        user.videoTrack.play(userContainer);
      } else if (!userContainer) {
        const playerContainer = document.createElement("div");
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.style.width = "680px";
        playerContainer.style.height = "510px";
        playerContainer.style.margin = "auto";
        playerContainer.style.marginTop = "100px";
        remoteContainer.appendChild(playerContainer);
        user.videoTrack.play(playerContainer);
      }
    });

    return remoteUsers.map((user) => (
      <div
        key={user.uid}
        id={`user-container-${user.uid}`}
        style={{
          margin: "auto",
          width: "680px",
          height: "510px",
          marginTop: "100px",
        }}
      />
    ));
  };

  // const getVideoLayout = () => {
  //   // remote-container가 존재하는지 확인하고, 필요하면 생성합니다.
  //   let remoteContainer = document.getElementById("remote-container");
  //   if (!remoteContainer) {
  //     remoteContainer = document.createElement("div");
  //     remoteContainer.id = "remote-container";
  //     document.body.appendChild(remoteContainer); // 이 부분은 적절한 위치에 맞게 조정해야 할 수 있습니다.
  //   }

  //   // 각 원격 사용자에 대해 비디오 트랙을 재생하는 코드를 추가합니다.
  //   remoteUsers.forEach((user) => {
  //     const userContainer = document.getElementById(
  //       `user-container-${user.uid}`
  //     );
  //     if (userContainer && user.videoTrack) {
  //       user.videoTrack.play(userContainer);
  //     } else if (!userContainer && remoteContainer) {
  //       const playerContainer = document.createElement("div");
  //       playerContainer.id = `user-container-${user.uid}`;
  //       playerContainer.style.width = "640px";
  //       playerContainer.style.height = "480px";
  //       remoteContainer.appendChild(playerContainer);
  //       user.videoTrack.play(playerContainer);
  //     }
  //   });

  //   // 비디오 피드와 버튼을 감싸는 div 생성
  //   return (
  //     <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
  //       {joinState && localVideoTrack && renderLocalUser()}
  //       <div
  //         id="remote-container"
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           flexWrap: "wrap",
  //         }}
  //       >
  //         {remoteUsers.map((user) => (
  //           <div
  //             key={user.uid}
  //             id={`user-container-${user.uid}`}
  //             style={{ margin: "10px" }}
  //           ></div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // 상단에 정의된 스타일 컴포넌트를 사용
  const getVideoLayout = () => {
    // 로컬 사용자 비디오 렌더링
    const localUser = renderLocalUser();

    // 원격 사용자 비디오 렌더링, 최대 1명만 표시
    const remoteUser = remoteUsers.length > 0 ? renderRemoteUsers()[0] : null;

    // VideoContainer 컴포넌트 안에 로컬 및 원격 사용자 비디오를 배치
    return (
      <VideoContainer>
        {localUser}
        {remoteUser}
      </VideoContainer>
    );
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
        display: "flex",
        flexDirection: "column", // Ensure elements are stacked vertically
        justifyContent: "flex-start", // Align content to the start of the container
        alignItems: "center", // Center items horizontally
        height: "100vh", // Full viewport height
        width: "100%", // Full viewport width
      }}
    >
      {joinState ? (
        <>
          {/* Video feeds container */}
          <div
            id="video-container"
            style={{ width: "100%", marginTop: "-50px", marginBottom: "100px" }}
          >
            {getVideoLayout()}
          </div>

          {/* Button container */}
          <div id="button-container" style={{ marginTop: "100px" }}>
            {" "}
            {/* Push the button to the bottom */}
            <Button onClick={handleLeave} variant="contained" color="primary">
              상담 끝내기
            </Button>
          </div>
        </>
      ) : (
        renderJoinForm() // Render the join form if not joined
      )}
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

const VideoContainer = styled.div`
  display: flex;
  flex-direction: row; // 가로로 나열
  align-items: stretch; // 컨테이너 높이에 맞춰 비디오 높이 조정
  width: 100%;
  max-height: 480px; // 비디오 높이 제한
  margin-top: 100px;
`;
