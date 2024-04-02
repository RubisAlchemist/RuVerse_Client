import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

/**
 * aws s3 v3
 */
import { Upload } from "@aws-sdk/lib-storage";
import {
  S3Client,
  S3,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const VideoRecorder = forwardRef(({ reduxData, uid, channelName }, ref) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const serverAddress = process.env.REACT_APP_BACKEND_ADDRESS_DEV;
  // const videoRef = useRef(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        // if (videoRef.current) videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
            console.log("recordedChunks: ", recordedChunks);
          }
        };

        console.log("MediaRecorder is ready");
      } catch (error) {
        console.error("Error getting user media", error);
      }
    }
    getMedia();
  }, []);

  // useEffect(() => {
  //   if (mediaRecorder) {
  //     console.log('MediaRecorder is set and ready for commands');
  //   }
  // }, [mediaRecorder]);

  useImperativeHandle(ref, () => ({
    startRecording() {
      // console.log('Attempting to start recording');
      if (mediaRecorder && mediaRecorder.state === "inactive") {
        mediaRecorder.start();
        setRecording(true);
        console.log("Recording started");
      } else {
        console.log("MediaRecorder not ready or already recording");
      }
    },
    // async stopRecording() {
    //   if (mediaRecorder && mediaRecorder.state === "recording") {
    //     mediaRecorder.stop();
    //     setRecording(false);
    //     console.log("Recording stopped");

    //     // 녹화 중지 후 recordedChunks를 기반으로 Blob 생성 후 반환
    //     return new Promise((resolve) => {
    //       const handleDataAvailable = (event) => {
    //         if (event.data.size > 0) {
    //           resolve(new Blob(recordedChunks, { type: "video/mp4" }));
    //         }
    //       };

    //       mediaRecorder.addEventListener("dataavailable", handleDataAvailable, {
    //         once: true,
    //       });
    //     });
    //   } else {
    //     console.log("MediaRecorder not recording");
    //     return null;
    //   }
    // },
    async stopRecording() {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        return new Promise((resolve, reject) => {
          // 녹화를 멈춥니다.
          mediaRecorder.stop();

          // dataavailable 이벤트가 발생할 때까지 기다립니다.
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setRecordedChunks((prev) => [...prev, event.data]);
            }
          };

          // onstop 이벤트를 사용하여 모든 데이터가 수집된 후 Blob을 생성합니다.
          mediaRecorder.onstop = () => {
            setTimeout(() => {
              // 상태 업데이트를 위해 약간의 지연을 줍니다.
              const blob = new Blob(recordedChunks, { type: "video/mp4" });
              if (blob.size > 0) {
                resolve(blob);
              } else {
                reject("Recording failed to produce a valid blob.");
              }
            }, 1000);
          };
        });
      } else {
        console.log("MediaRecorder not recording");
        return Promise.reject("Recorder is not in recording state.");
      }
    },
    stopAndDownloadRecording() {
      console.log("Recording state before stopping:", mediaRecorder.state);
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // 이벤트 발생 시 청크 추가
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log("Recording stopped.");
          const blob = new Blob(recordedChunks, { type: "video/mp4" });
          console.log("Blob created with size:", blob.size);

          // Blob이 생성된 후 바로 업로드 로직을 실행
          // await uploadData(blob);

          // Blob 크기를 메가바이트로 변환
          const sizeMB = blob.size / (1024 * 1024);
          // 200MB 이상인 경우
          if (sizeMB >= 200) {
            console.log("동영상 용량 200MB 이상");
            await uploadToS3(blob);
          } else {
            console.log("동영상 용량 200MB 미만");
            await uploadToS3SmallSize(blob);
          }
          setRecordedChunks([]); // 청크 초기화
        };

        mediaRecorder.stop(); // 녹화 중지
        setRecording(false);
      } else {
        console.log("MediaRecorder not recording or already stopped.");
      }
    },
  }));

  /**
   * 용량 작은거 업로드
   */
  const uploadToS3SmallSize = async (blob) => {
    console.log("[CALL] uploadToS3SmallSize");
    /**
     * S3 ENV
     */
    const REGION = process.env.REACT_APP_REGION;
    const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
    const SECRET_ACCESS_KEY_ID = process.env.REACT_APP_SECRET_ACCESS_KEY_ID;
    const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;

    const key =
      channelName + "_" + uid + "_" + new Date().toISOString() + ".mp4";
    let file = new File([blob], key, {
      type: "video/mp4",
      lastModified: Date.now(),
    });

    console.log("upload target");
    console.log(blob);

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
    } catch (err) {
      console.log(`${key} uploaded failed.`);
      console.log(err);
    }
  };

  /**
   * 대용량 파일 업로드
   */
  const uploadToS3 = async (blob) => {
    console.log("[CALL] uploadToS3");
    const REGION = process.env.REACT_APP_REGION;
    const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
    const SECRET_ACCESS_KEY_ID = process.env.REACT_APP_SECRET_ACCESS_KEY_ID;
    const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
    const key =
      channelName + "_" + uid + "_" + new Date().toISOString() + ".mp4";

    let file = new File([blob], key, {
      type: "video/mp4",
      lastModified: Date.now(),
    });

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
    } catch (err) {
      console.log("upload failed");
      console.log(err);
    }
  };

  const uploadData = async (blob) => {
    console.log("이태휘");
    // const blob = new Blob(recordedChunks, { type: "video/mp4" });
    const formData = new FormData();
    formData.append("videoFile", blob, "recording.mp4");

    const updatedReduxData = {
      ...reduxData,
      uid,
      channelName,
    };

    formData.append("reduxData", JSON.stringify(updatedReduxData));

    console.log(updatedReduxData);

    const uploadURL = `${serverAddress}upload`; // URL에 슬래시(/)를 확인해 주세요.

    console.log(uploadURL);

    try {
      const response = await fetch(uploadURL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log("Upload successful:", data);
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
    }

    setRecordedChunks([]);
  };
  // useEffect(() => {
  //   if (recordedChunks.length > 0) {
  //     // const blob = new Blob(recordedChunks, { type: "video/mp4" });
  //     // const url = URL.createObjectURL(blob);
  //     // const a = document.createElement("a");
  //     // a.href = url;
  //     // a.download = "recording.mp4";
  //     // document.body.appendChild(a);
  //     // a.click();
  //     // document.body.removeChild(a);
  //     // URL.revokeObjectURL(url);
  //     // console.log("Recording downloaded:", url);
  //     // ref.current.stopAndSendRecording();
  //     console.log("이태휘");
  //     const blob = new Blob(recordedChunks, { type: "video/mp4" });
  //     const formData = new FormData();
  //     formData.append("videoFile", blob, "recording.mp4");

  //     const updatedReduxData = {
  //       ...reduxData,
  //       uid,
  //       channelName,
  //     };

  //     formData.append("reduxData", JSON.stringify(updatedReduxData));

  //     console.log(updatedReduxData);

  //     const uploadURL = `${serverAddress}upload`; // URL에 슬래시(/)를 확인해 주세요.

  //     console.log(uploadURL);

  //     try {
  //       const response = fetch(uploadURL, {
  //         method: "POST",
  //         body: formData,
  //       });
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = response.json();
  //       console.log("Upload successful:", data);
  //     } catch (error) {
  //       console.error("Upload error:", error);
  //     }

  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  return null;
});

export default VideoRecorder;
