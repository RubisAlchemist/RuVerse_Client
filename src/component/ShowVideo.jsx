import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React from "react";
import { useSelector } from "react-redux";

const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY; // .env 파일 또는 환경 변수에서 Agora App ID

function ShowVideo() {
  const channel = useSelector((state) => state.channel);

  /**
   * useJoin 두 번째 인자가 true면 uid, 채널이름에 해당하는
   * 곳으로 자동 연결됨
   *
   * 채널 나가는 조건:
   * ShowVideo 컴포넌트가 언마운트될 때 채널 자동으로 나가지게끔
   * 만들어진듯
   */
  useJoin(
    {
      appid: appId,
      uid: channel.uid,
      channel: channel.name,
      token: null,
    },
    channel.call
  );

  /**
   * 원격 사용자 리스트
   */
  const remoteUsers = useRemoteUsers();

  /**
   * Local 사용자 카메라트랙 불러오기
   *
   * 만약 오디오 트랙도 사용하고 싶으면 useLocalAudioTrack 사용
   */
  const { isLoading: isLoadingAudio, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

  /**
   * 카메라, 오디오 publishing 하기 -> 요 훅 호출해야 상대방한테도 오디오, 비디오 출력됨
   * 배열 인자 안에 카메라, 오디오에 해당하는 트랙 넣어주면 됨
   */
  usePublish([localMicrophoneTrack, localCameraTrack]);

  //   카메라 로딩 기다리기
  const deviceLoading = isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <>
      {/* Local User */}
      {/* play 이용해서 비디오 출력 유무 결정*/}
      <LocalVideoTrack
        track={localCameraTrack}
        play={true}
        style={{
          width: "680px",
          height: "510px",
          margin: "auto",
          marginTop: "80px",
        }}
      />
      {/* Remote User */}
      {remoteUsers.map((user) => (
        // 요 컴포넌트가 알아서 원격 사용자 비디오, 오디오 출력해줌
        <RemoteUser
          user={user}
          style={{
            width: "680px",
            height: "510px",
            margin: "auto", // This centers the video in its container
            marginTop: "80px",
          }}
        />
      ))}
    </>
  );
}

export default ShowVideo;
