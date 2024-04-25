import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadIcon from "@mui/icons-material/Upload";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Buffer } from "buffer";
import { useState } from "react";
import { useContext } from "react";
import { RecordContext } from "../../context/record-context";
import {
  closeModal,
  startUpload,
  uploadSuccess,
} from "../../store/upload/uploadSlice";
import { unSetCall } from "../../store/channel/channelSlice";

const REGION = process.env.REACT_APP_REGION;
const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY_ID = process.env.REACT_APP_SECRET_ACCESS_KEY_ID;
const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const serverAddress = process.env.REACT_APP_BACKEND_ADDRESS_DEV;

const UploadToS3Modal = () => {
  const { screenRecordBlob, videoRecordBlob } = useContext(RecordContext);

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
   * Logger 데이터
   */
  const gpsData = useSelector((state) => state.logger.gps);
  const touchData = useSelector((state) => state.channel.touch);
  const accelGyroData = useSelector((state) => state.channel.accelGyro);
  const stylusData = useSelector((state) => state.channel.stylus);
  const eyetrackingData = useSelector((state) => state.channel.eyetracking);

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

    const loggerDataFile = Buffer.from(JSON.stringify(loggerData).toString());

    const loggerDataSizeMB = loggerDataFile.length / (1024 * 1024);
    console.log(`[HANDLE_UPLOAD] logger data size = ${loggerDataSizeMB}`);

    const loggerKey =
      channelName +
      "_" +
      uid +
      "_" +
      "logger_Data" +
      "_" +
      new Date().toISOString() +
      ".json";

    if (loggerDataSizeMB >= 200) {
      await uploadToS3(loggerKey, loggerDataFile);
    } else {
      await uploadToS3SmallSize(loggerKey, loggerDataFile);
    }
    // 비디오 업로드
    const videoRecordSizeMB = videoRecordBlob.size / (1024 * 1024);

    const videoKey =
      channelName +
      "_" +
      uid +
      "_" +
      "비디오" +
      new Date().toISOString() +
      ".mp4";

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
    console.log(`[HANDLE_UPLOAD] screen blob size = ${screenRecordBlob.size}`);
    const screenRecordSizeMB = videoRecordBlob.size / (1024 * 1024);

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

    // const videoKey =
    //   channelName +
    //   "_" +
    //   uid +
    //   "_" +
    //   "비디오" +
    //   new Date().toISOString() +
    //   ".mp4";

    // let file = new File([blob], videoKey, {
    //   type: "video/mp4",
    //   lastModified: Date.now(),
    // });

    // 로거데이터 업로드 로거 데이타 키값
    // const loggerDataKey = await uploadLoggerData();

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

    // const videoKey =
    //   channelName +
    //   "_" +
    //   uid +
    //   "_" +
    //   "비디오" +
    //   new Date().toISOString() +
    //   ".mp4";

    // let file = new File([blob], videoKey, {
    //   type: "video/mp4",
    //   lastModified: Date.now(),
    // });

    // 로거데이터 업로드
    // const loggerDataKey = await uploadLoggerData();

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
  /**
   * 로거 값 json으로 변환해서 S3 전송
   * @returns 로거 텍스트 파일 키값
   */

  const uploadLoggerData = async () => {
    console.log("[UPLOAD LOGGER] 로거 데이터 업로드");

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

    const loggerKey =
      channelName +
      "_" +
      uid +
      "_" +
      "logger_Data" +
      "_" +
      new Date().toISOString() +
      ".json";

    const file = Buffer.from(JSON.stringify(loggerData).toString());

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
          Key: loggerKey,
          ContentEncoding: "base64",
          ContentType: "application/json",
        })
      );

      console.log(`${loggerKey} uploaded successfully.`);
      console.log(response);

      return loggerKey;
    } catch (err) {
      console.log(`${loggerKey} uploaded failed.`);
      console.log(err);
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
