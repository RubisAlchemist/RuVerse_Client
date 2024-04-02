import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import { createChannel, createClient, RtmMessage } from "agora-rtm-react";
import EyetrackingContext from "./eyetrackingContext";
import videocallImage from "../images/videocallImage.png";
import styled from "styled-components";
import { Button } from "@mui/material";
import { initialState, dataArchiveReducer } from "../store/dataSave/reducer";
import { useReducer } from "react";
import VideoRecorder from "../component/videoRecorder";

export default function VideocallPage({
  joinState,
  setJoinState,
  reduxData,
  dispatch,
}) {
  //   const { RtcTokenBuilder, RtcRole } = require("agora-token");

  const { gazeData, isWebgazerInitialized } = useContext(EyetrackingContext);

  // const reduxData = useSelector(state => state.dataReducer);
  // const reduxData = useSelector(state => state.dataArchiveReducer);
  // const [reduxData, dispatch] = useReducer(dataArchiveReducer, initialState);

  // useEffect(() => {
  //   console.log("Redux Data:", reduxData); // Ensure reduxData is accessible here
  // }, [reduxData]); // Add reduxData as a dependency to re-run the effect when it changes

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
  // const rtmClient = useRef(null);
  // const rtmChannel = useRef(null);

  const [channelName, setChannelName] = useState("");
  const [uid, setUid] = useState("");
  // const [joinState, setJoinState] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [trackEnded, setTrackEnded] = useState(false); // 비디오 트랙이 종료되었는지 여부를 추적하는 상태
  const [rtmClient, setRtmClient] = useState(null);
  const [rtmChannel, setRtmChannel] = useState(null);
  // const [isRecording, setIsRecording] = useState(false);
  const videoRecorderRef = useRef();

  const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY; // .env 파일 또는 환경 변수에서 Agora App ID
  const serverAddress = process.env.REACT_APP_BACKEND_ADDRESS_DEV;

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      rtmChannel?.leave();
      rtmClient?.logout();
    };
  }, [rtmChannel, rtmClient]);

  // useEffect(() => {
  //   if (isWebgazerInitialized) {
  //     client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  //     subscribeToEvents();
  //     return () => {
  //       if (localVideoTrack) {
  //         localVideoTrack.close();
  //       }
  //       if (localAudioTrack) {
  //         localAudioTrack.close();
  //       }
  //       client.current && client.current.leave();
  //     };
  //   }
  // }, [isWebgazerInitialized]);

  useEffect(() => {
    if (!isWebgazerInitialized) return;

    // Agora RTC 클라이언트 초기화
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    subscribeToEvents();

    return () => {
      // 컴포넌트 언마운트 시 클린업
      localVideoTrack && localVideoTrack.close();
      localAudioTrack && localAudioTrack.close();
      client.current && client.current.leave();
    };
  }, [isWebgazerInitialized]);

  useEffect(() => {
    renderRemoteUsers();
    return () => {
      remoteUsers.forEach((user) => {
        if (user.videoTrack) {
          user.videoTrack.stop();
          user.videoTrack.close();
        }

        // DOM에서 플레이어 컨테이너 제거
        const playerElementId = `user-container-${user.uid}`;
        const playerContainer = document.getElementById(playerElementId);
        if (playerContainer) {
          playerContainer.remove();
        }
      });
    };
  }, [remoteUsers]);

  const subscribeToEvents = () => {
    client.current.on("user-published", async (user, mediaType) => {
      await client.current.subscribe(user, mediaType);

      // 이미 존재하는 사용자인지 확인
      if (remoteUsers.find((existingUser) => existingUser.uid === user.uid)) {
        return; // 이미 존재하는 사용자이면 여기서 처리를 중단
      }

      // 새로운 원격 사용자의 video track을 DOM에 추가하기 전에 이미 있는지 확인합니다.
      const existingUserContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (!existingUserContainer && mediaType === "video") {
        setTrackEnded(false);
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
        setTrackEnded(false);
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
      setTrackEnded(true);
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

      // 모든 참가자가 통화를 종료하고 초기 조인 폼으로 리다이렉트합니다.
      handleLeave(); // 변경된 부분
    });
  };

  const handleJoin = async () => {
    // 클라이언트가 초기화되지 않았거나 이미 조인 상태인 경우 early return 처리
    if (!client.current || joinState) return;

    try {
      // Agora 채널에 조인합니다.
      await client.current.join(appId, channelName, null, uid || null);

      // 비디오와 오디오 트랙을 생성합니다.
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      // 생성된 트랙들을 퍼블리시합니다.
      await client.current.publish([videoTrack, audioTrack]);

      // 상태를 업데이트합니다.
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      setJoinState(true);

      // 로컬 비디오를 재생합니다.
      videoTrack.play("local-player");
    } catch (error) {
      console.error("Failed to join the channel:", error);
    }

    // 사용자 입력에 기반하여 RTM 클라이언트 설정 및 채널 조인
    const tempclient = createClient(appId);
    const tempchannel = createChannel(channelName);

    setRtmClient(tempclient);
    setRtmChannel(tempchannel);

    const testClient = tempclient();
    const testChannel = tempchannel(testClient);

    // RTM 로그인 및 채널 조인
    await testClient.login({ uid: uid });
    await testChannel.join();

    // 메시지 리스너 설정
    testChannel.on("ChannelMessage", ({ text }, senderId) => {
      if (text === "endSession") {
        // uid.videoRecorderRef.current?.stopAndDownloadRecording();
        // handleLeave();
        videoRecorderRef.current.stopAndDownloadRecording();
      }
    });

    if (videoRecorderRef.current) {
      // console.log("레코딩 1");
      videoRecorderRef.current.startRecording(); // 녹화 시작
    }
  };

  const handleLeave = async () => {
    // RTM을 통해 모든 사용자에게 "상담 끝내기" 메시지 전송
    if (rtmChannel) {
      await rtmChannel
        .sendMessage({ text: "endSession" })
        .then(() => {
          console.log("Sent 'endSession' message to all users.");
        })
        .catch((error) => {
          console.error("Failed to send 'endSession' message:", error);
        });
    }

    // ... (녹화 중지 및 데이터 업로드 로직)

    // if (videoRecorderRef.current) {
    //   // console.log("레코딩 2");
    //   await videoRecorderRef.current.stopAndDownloadRecording(); // 녹화 중지 및 다운로드
    // }

    // if (videoRecorderRef.current) {
    //   const videoBlob = await videoRecorderRef.current.stopRecording();
    //   if (videoBlob) {
    //     const formData = new FormData();
    //     formData.append("videoFile", videoBlob, "recording.mp4");

    // const updatedReduxData = {
    //   ...reduxData,
    //   uid,
    //   channelName,
    // };

    //     // console.log("updatedReduxData: ", JSON.stringify(updatedReduxData));

    //     // reduxData를 FormData에 추가 (예시로 JSON 문자열로 변환)
    //     formData.append("reduxData", JSON.stringify(updatedReduxData));

    //     // 서버 엔드포인트 URL
    //     const uploadURL = `${serverAddress}upload`;

    //     // for (let [key, value] of formData.entries()) {
    //     //   console.log(`${key}: ${value}`);
    //     // }

    //     // console.log("formData: ", formData);

    //     try {
    //       const response = await fetch(uploadURL, {
    //         method: "POST",
    //         body: formData,
    //       });
    //       const data = await response.json();
    //       console.log("Upload successful:", data);
    //     } catch (error) {
    //       console.error("Upload error:", error);
    //     }
    //   }
    // }

    // // RTM 클라이언트 로그아웃 및 채널 나가기
    // if (rtmClient && rtmChannel) {
    //   await rtmChannel.leave();
    //   await rtmClient.logout();
    // }

    // if (localVideoTrack) {
    //   localVideoTrack.stop();
    //   localVideoTrack.close();
    // }
    // if (localAudioTrack) {
    //   localAudioTrack.stop();
    //   localAudioTrack.close();
    // }

    // if (client.current) {
    //   await client.current.leave();
    // }

    // console.log("Uploading data:", reduxData);

    // setJoinState(false);
    // setLocalVideoTrack(null);
    // setLocalAudioTrack(null);

    // setRemoteUsers([]); // 원격 사용자 목록을 초기화하여 리렌더링 유발
    setTrackEnded(true);
    console.log("여기여기");
    // const videoContainer = document.getElementById("video-container");
    // if (videoContainer) {
    //   videoContainer.innerHTML = ""; // 이를 통해 내부 엘리먼트를 모두 제거
    // }

    // const remoteContainer = document.getElementById("remote-container");
    // if (remoteContainer) {
    //   remoteContainer.innerHTML = ""; // 이를 통해 내부 엘리먼트를 모두 제거
    // }
    // renderJoinForm();
    // setTimeout(() => {
    // }, 3000);
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
            marginTop: "80px",
          }}
        ></div>
      );
    }
    return null;
  };

  // Function to render the remote users' videos
  const renderRemoteUsers = () => {
    // Ensure the remote-container exists
    let remoteContainer = document.getElementById("remote-container");
    if (!remoteContainer) {
      remoteContainer = document.createElement("div");
      remoteContainer.id = "remote-container";
      document.body.appendChild(remoteContainer); // Adjust this as needed
    }

    // Play each remote user's video track
    remoteUsers.forEach((user) => {
      const userContainer = document.getElementById(
        `user-container-${user.uid}`
      );
      if (userContainer) {
        // If the container exists, check if the video track exists before playing
        if (user.videoTrack) {
          user.videoTrack.play(userContainer);
        }
      } else {
        // If the container doesn't exist, create it and play the video track
        const playerContainer = document.createElement("div");
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.style.width = "680px";
        playerContainer.style.height = "510px";
        playerContainer.style.margin = "auto";
        playerContainer.style.marginTop = "80px";
        remoteContainer.appendChild(playerContainer);

        if (user.videoTrack && !user.videoTrack.isPlaying()) {
          user.videoTrack.play(playerContainer);
        }
      }
    });

    // Return elements for remote users
    return remoteUsers.map((user) => (
      <div
        key={user.uid}
        id={`user-container-${user.uid}`}
        style={{
          margin: "auto",
          width: "680px",
          height: "510px",
          marginTop: "80px",
        }}
      />
    ));
  };

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

  const renderJoinForm = () => {
    return (
      <JoinFormContainer>
        <InputGroup>
          <InputLabel>상담소명 :</InputLabel>
          <StyledInput
            type="text"
            placeholder="주어진 상담소 이름을 입력하세요"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>이름 : </InputLabel>
          <StyledInput
            type="text"
            placeholder="당신의 이름을 입력하세요"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
        </InputGroup>
        <StyledImg src={videocallImage}></StyledImg>
        <Button
          onClick={handleJoin}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          상담 시작하기
        </Button>
      </JoinFormContainer>
    );
  };

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
      {joinState ? (
        <>
          {/* Video feeds container */}
          <div
            id="video-container"
            style={{ width: "100%", marginTop: "-50px", marginBottom: "80px" }}
          >
            {getVideoLayout()}
          </div>

          {/* Button container */}
          <div id="button-container" style={{ marginTop: "80px" }}>
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
      <VideoRecorder
        ref={videoRecorderRef}
        reduxData={reduxData}
        uid={uid}
        channelName={channelName}
        style={{ display: joinState ? "block" : "none" }}
      />
    </div>
  );
}

const StyledImg = styled.img`
  width: 90%;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 80vw; // On smaller screens, the image will take up 80% of the viewport width
  }
`;

const StyledInput = styled.input`
  flex-grow: 1;
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
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const InputLabel = styled.label`
  width: 80px; // 레이블의 너비를 고정
  text-align: right; // 텍스트를 오른쪽으로 정렬
  margin-right: 10px;
`;

const JoinFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: -30px;
`;
