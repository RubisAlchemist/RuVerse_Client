import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RecordContext } from "../../context/record-context";
import { closeModal, uploadSuccess } from "../../store/upload/uploadSlice";
import { agoraClient } from "../../apis/agora";

const REGION = process.env.REACT_APP_REGION;
const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY_ID = process.env.REACT_APP_SECRET_ACCESS_KEY_ID;
const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const serverAddress = process.env.REACT_APP_BACKEND_ADDRESS_DEV;

const UploadToS3Modal = () => {
  const { videoRecordBlob } = useContext(RecordContext);

  const modal = useSelector((state) => state.upload.modal);

  const [isWait, setIsWait] = useState(true);

  const dispatch = useDispatch();
  /**
   * 채널 이름
   * uid
   */
  const channelName = useSelector((state) => state.channel.name.value);
  const uid = useSelector((state) => state.channel.uid.value);

  /**
   * 아고라 업로드 정보
   */
  const resourceId = useSelector((state) => state.agora.resourceId);
  const sid = useSelector((state) => state.agora.sid);

  /**
   * Logger 데이터
   */
  const gpsData = useSelector((state) => state.logger.gps);
  const touchData = useSelector((state) => state.logger.touch);
  const accelGyroData = useSelector((state) => state.logger.accelGyro);
  const stylusData = useSelector((state) => state.logger.stylus);
  const eyetrackingData = useSelector((state) => state.logger.eyetracking);

  const handleUpload = async () => {
    setIsWait(false);

    // 로거 업로드
    const loggerData = {
      gpsData,
      touchData,
      accelGyroData,
      stylusData,
      eyetrackingData,
      uid,
      channelName,
    };
    console.log(loggerData);

    const loggerDataFile = Buffer.from(JSON.stringify(loggerData).toString());

    const loggerDataSizeMB = loggerDataFile.length / (1024 * 1024);
    console.log(`[HANDLE_UPLOAD] logger data size = ${loggerDataSizeMB}`);

    const loggerKey = `${channelName}_${uid}_logger_Data_${new Date().toISOString()}.json`;

    if (loggerDataSizeMB >= 200) {
      await uploadToS3(loggerKey, loggerDataFile);
    } else {
      await uploadToS3SmallSize(loggerKey, loggerDataFile);
    }
    // 비디오 업로드
    const videoRecordSizeMB = videoRecordBlob.size / (1024 * 1024);

    const videoKey = `${channelName}_${uid}_비디오${new Date().toISOString()}.mp4`;

    let videoFile = new File([videoRecordBlob], videoKey, {
      type: "video/mp4",
      lastModified: Date.now(),
    });
    console.log(`[HANDLE_UPLOAD] video blob size = ${videoRecordSizeMB}`);
    if (videoRecordSizeMB >= 200) {
      await uploadToS3(videoKey, videoFile);
    } else {
      await uploadToS3SmallSize(videoKey, videoFile);
    }

    // 스크린 업로드
    // console.log(`[HANDLE_UPLOAD] screen blob size = ${screenRecordBlob.size}`);
    // const screenRecordSizeMB = videoRecordBlob.size / (1024 * 1024);

    /*
    스크린 녹화는 아고라 cloud recording 사용함에 따라 주석 처리
    const screenKey =
      channelName +
      "_" +
      uid +
      "_" +
      "스크린" +
      new Date().toISOString() +
      ".mp4";
    
    let screenFile = new File([screenRecordBlob], screenKey, {
      type: "video/mp4",
      lastModified: Date.now(),
    });
    console.log(`[HANDLE_UPLOAD] screen blob size = ${screenRecordSizeMB}`);
    if (screenRecordSizeMB >= 200) {
      await uploadToS3(screenKey, screenFile);
    } else {
      await uploadToS3SmallSize(screenKey, screenFile);
  }
  
  */

    // 아고라 네이밍 컨벤션에 따른 스크린 녹화 키 설정
    // https://docs.agora.io/en/cloud-recording/develop/manage-files
    const screenKey = `${sid}_${channelName}_0.mp4`;
    try {
      const response = await stopAgoraRecording(
        channelName,
        uid,
        resourceId,
        sid
      );
    } catch (error) {
      console.log("[REQUEST STOP RECORDING] failed");
      console.log(error.message);
    }

    await uploadDB(channelName, uid, loggerKey, videoKey, screenKey);

    // 업로드 완료한 경우
    dispatch(uploadSuccess());
    dispatch(closeModal());
  };

  /**
   * 용량 작은거 업로드
   */
  const uploadToS3SmallSize = async (key, file) => {
    console.log("[CALL] uploadToS3SmallSize");

    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY_ID,
      },
    });

    try {
      const response = await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Body: file,
          Key: key,
        })
      );

      console.log(`${key} uploaded successfully.`);
      console.log(response);
      // channelName & Uid & loggerDataKey & videoKey 서버 전달
      //   await uploadDB(channelName, uid, loggerDataKey, videoKey);
    } catch (err) {
      console.log(`${key} uploaded failed.`);
      console.log(err);
    }
  };

  /**
   * 대용량 파일 업로드
   */
  const uploadToS3 = async (key, file) => {
    console.log("[CALL] uploadToS3");

    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY_ID,
      },
    });

    try {
      const upload = new Upload({
        client: s3Client,
        leavePartsOnError: false,
        params: {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: file,
        },
      });

      upload.on("httpUploadProgress", (process) => console.log(process));

      await upload.done();
      // channelName & Uid & loggerDataKey & videoKey 서버 전달
      //   await uploadDB(channelName, uid, loggerDataKey, videoKey);
    } catch (err) {
      console.log("upload failed");
      console.log(err);
    }
  };

  // 아고라 cloud recording stop 요청
  // stop 이후 S3 업로드 진행됨
  const stopAgoraRecording = async (cname, uid, resourceId, sid) => {
    console.log(`[REQUEST STOP RECORDING] cname: ${cname} uid: ${uid}`);

    if (!resourceId || !sid) {
      throw new Error(
        `chaennel: ${cname} uid: ${uid}에 대한 resourceId 또는 sid가 존재하지 않습니다.`
      );
    }

    try {
      const response = await agoraClient.post(
        `/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/web/stop`,
        {
          cname: cname, // 녹화할 채널 이름
          uid: uid, // 녹화 요청한 유저 uid
          clientRequest: {},
        }
      );
      console.log(
        `[REQUEST STOP RECORDING SUCCESS] cname: ${cname} uid: ${uid}`
      );
      console.log(response);
    } catch (error) {
      console.log(`[CALL STOP RECORDING FAILED]`);
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      // console.log(error.config);
      throw new Error(error.message);
    }
  };

  const uploadDB = async (
    channelName,
    uid,
    loggerDataKey,
    videoKey,
    screenKey
  ) => {
    const uploadURL = `${serverAddress}upload`;

    console.log(uploadURL);

    // 전송할 데이터 구성
    const payload = {
      channelName,
      uid,
      loggerDataKey,
      videoKey,
      screenKey,
    };

    try {
      // Fetch API를 사용하여 POST 요청을 보냅니다.
      const response = await fetch(uploadURL, {
        method: "POST", // HTTP 메소드
        headers: {
          "Content-Type": "application/json", // 내용 유형 지정
        },
        body: JSON.stringify(payload), // JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        // 응답이 성공적이지 않은 경우, 에러를 던집니다.
        throw new Error(`Error: ${response.statusText}`);
      }

      // 응답 데이터를 JSON 형태로 파싱
      const data = await response.json();

      console.log("Upload successful:", data);
      // 추가적인 작업을 수행할 수 있습니다.
    } catch (error) {
      // 에러 핸들링
      console.error("Upload failed:", error);
    }
  };

  return (
    <Modal
      open={modal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {isWait ? (
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              녹화 업로드
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="caption"
              component="p"
              color="crimson"
            >
              업로드 완료 후 퇴장합니다.
            </Typography>
            <Button variant="outlined" color="info" onClick={handleUpload}>
              <UploadIcon fontSize="medium" />
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            녹화 영상 업로드중입니다.
          </Typography>
          <CircularProgress
            style={{ marginTop: "12px", alignSelf: "center" }}
          />
        </Box>
      )}
    </Modal>
  );
};

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default UploadToS3Modal;
