import React, { useEffect } from "react";

import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import webgazer from "webgazer";
import { agoraClient } from "../../apis/agora";
import { RecordProvider } from "../../context/record-context";
import { setResourceId, setSid } from "../../store/agora/channelSlice";
import { openModal } from "../../store/upload/uploadSlice";
import RecordButton from "./RecordButton";
import RecordErrorModal from "./RecordErrorModal";

const RecordManager2 = ({ children }) => {
  // 업로드 할 비디오, 화면 녹화 블롭 파일
  const [videoRecordBlob, setVideoRecordBlob] = useState(null);
  // const [screenRecordBlob, setScreenRecordBlob] = useState(null);

  const dispatch = useDispatch();
  const resourceId = useSelector((state) => state.agora.resourceId);
  const sid = useSelector((state) => state.agora.sid);

  const { cname, uid } = useParams();

  const [errorModal, setErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  // 비디오 오디오 녹화
  const {
    status: videoStatus,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    error: videoError,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${videoStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setVideoRecordBlob(blob);
    },
  });

  // 로컬 화면 녹화
  // 아고라 cloud recording 기능 사용으로 인한 주석 처리
  /*
  const {
    status: screenStatus,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    error: screenError,
  } = useReactMediaRecorder({
    screen: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    askPermissionOnMount: false,
    onStart: () => {
      console.log(`[RECORDER] screen record start = ${screenStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] screen record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setScreenRecordBlob(blob);
    },
  });
  */

  // 녹화 시작 할 때 webgazer 실행
  const startRecording = async () => {
    setIsLoading(true);
    try {
      console.log("[WEBGAZER] start");
      webgazer.begin();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    startVideoRecording();
    // startScreenRecording();

    try {
      const resourceId = await acquire(cname, uid);
      dispatch(setResourceId(resourceId));

      try {
        const sid = await record(cname, uid, resourceId);
        dispatch(setSid(sid));
        setIsLoading(false);
      } catch (error) {
        setErrorModal(true);
        setIsError(true);
        setIsLoading(false);
        setError(error.message);
      }
    } catch (error) {
      setErrorModal(true);
      setError(error.message);
      setIsError(true);
      setIsLoading(false);
      setError(error.message);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("[WEBGAZER] end");
      webgazer.pause();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    stopVideoRecording();
    dispatch(openModal());
    // stopScreenRecording();
  };

  /**
   * 1. call the acquire method
   * 아고라에 recording 요청을 보내기 전에 먼저 acquire 요청을 보내서
   * resource ID를 등록해야합니다.
   *    - recording stop 요청에 필요함
   *
   * @param {string} cname  - 녹화 요청한 유저가 들어간 채널 이름
   * @param {string} uid    - 녹화 요청한 유저의 uid
   * @return {string} resourceId
   */
  const acquire = async (cname, uid) => {
    try {
      const request = {
        cname: window.atob(cname),
        uid: window.atob(uid),
        clientRequest: {
          resourceExpiredHour: 24,
          scene: 1, // 1로 고정해야 합니다.
        },
      };

      console.log(`[CALL ACQUIRE]`);
      // Agora REST API 호출해 resourceId fetch

      const response = await agoraClient.post(
        "/cloud_recording/acquire",
        request
      );

      const { resourceId } = response.data;

      console.log(`[CALL ACQUIRE SUCESS] resourceId: ${resourceId}`);

      return resourceId;
    } catch (error) {
      console.log(`[CALL ACQUIRE FAILED]`);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error.message);
    }
  };

  /**
   * 2. request recording
   * 아고라에 recording 요청을 보냅니다.
   * 요청에 대한 response로 받은 sid를 메모리 캐시에 저장합니다.
   *  - sid: recording stop 요청에 필요
   * @param {string} cname  - 녹화 요청한 유저가 들어간 채널 이름
   * @param {string} uid    - 녹화 요청한 유저의 uid
   */
  const record = async (cname, uid, resourceId) => {
    if (!resourceId) {
      throw new Error(
        `chaennel: ${cname} uid: ${uid}에 대한 resourceId가 존재하지 않습니다.`
      );
    }

    // Agora REST API 호출해 녹화 요청
    // 웹 페이지에서 cname, uid는 url 상에서 base64 인코딩 된 상태로 표현 되므로
    // serviceParam url에 똑같이 Base64 인코딩해서 넘겨줌
    const recordUid = `${window.atob(uid)}1029384756`;
    console.log(`[REQUEST RECORDING] cname: ${cname} uid: ${uid}`);

    const url = `${process.env.REACT_APP_CLIENT_URL}/${cname}/${window.btoa(
      recordUid
    )}/record?local=${uid}`;

    console.log(`[URL] ${url}`);

    try {
      const response = await agoraClient.post(
        `/cloud_recording/resourceid/${resourceId}/mode/web/start`,
        {
          cname: window.atob(cname), // 녹화할 채널 이름
          uid: window.atob(uid), // 녹화 요청한 유저 uid
          clientRequest: {
            // token,
            extensionServiceConfig: {
              errorHandlePolicy: "error_abort",
              extensionServices: [
                {
                  serviceName: "web_recorder_service",
                  errorHandlePolicy: "error_abort",
                  serviceParam: {
                    url: url,
                    audioProfile: 0,
                    videoWidth: 1280,
                    videoHeight: 720,
                    maxRecordingHour: 1, // 녹화 최대 가능 시간
                  },
                },
              ],
            },
            recordingFileConfig: {
              avFileType: ["hls", "mp4"],
            },
            storageConfig: {
              // https://docs.agora.io/en/cloud-recording/reference/region-vendor
              vendor: 1, // 1: Amazon S3
              region: 11, // 11: ap-northeast-2
              bucket: process.env.REACT_APP_BUCKET_NAME,
              accessKey: process.env.REACT_APP_ACCESS_KEY_ID,
              secretKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
              fileNamePrefix: [],
            },
          },
        }
      );

      console.log(`[REQUEST RECORDING SUCCESS]`);
      console.log(response.data);

      const { sid } = response.data;
      return sid;
    } catch (error) {
      console.log(`[CALL RECORDING FAILED]`);

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    // 화면 또는 스크린 공유를 하지 않았을 경우 오류 발생

    if (videoError !== "" || isError) {
      console.log("[RECORDER] 녹화 오류 발생");
      console.log(`[RECORDER] screenError: ${error}`);
      console.log(`[RECORDER] videoError: ${videoError}`);
      setErrorModal(true);
    }
  }, [videoError, isError, error]);

  const handleRecordError = () => {
    if (videoStatus === "recording") {
      stopVideoRecording();
    }

    webgazer.end();
    setErrorModal(false);
  };

  const recordingStatus = videoStatus === "recording" && !isLoading;

  return (
    <RecordProvider
      videoRecordBlob={videoRecordBlob}
      // screenRecordBlob={screenRecordBlob}
    >
      {children}

      {recordingStatus ? (
        <RecordButton variant="outlined" color="error" onClick={stopRecording}>
          녹화 종료
        </RecordButton>
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        <RecordButton variant="outlined" color="error" onClick={startRecording}>
          녹화 시작
        </RecordButton>
      )}

      <RecordErrorModal open={errorModal} onClose={handleRecordError} />
    </RecordProvider>
  );
};

export default RecordManager2;
