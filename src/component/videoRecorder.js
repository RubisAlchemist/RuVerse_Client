import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

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
      // console.log('Attempting to stop and download recording');
      // console.log(mediaRecorder);
      // console.log(mediaRecorder.state);
      console.log("1: ", recordedChunks);
      if (mediaRecorder && mediaRecorder.state === "recording") {
        //   mediaRecorder.onstop = () => {
        //   console.log("check here1");
        //   // if (recordedChunks.length > 0) {
        //   //   // console.log("check here2");
        //   //   const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        //   //   const url = URL.createObjectURL(blob);
        //   //   const a = document.createElement('a');
        //   //   a.href = url;
        //   //   a.download = 'recording.mp4'; // 파일 이름
        //   //   document.body.appendChild(a);
        //   //   a.click();
        //   //   document.body.removeChild(a);
        //   //   URL.revokeObjectURL(url);
        //   //   console.log('Recording download URL:', url);
        //   // }
        // };
        mediaRecorder.stop();
        setRecording(false);
        console.log("Recording stopped");

        console.log("2: ", recordedChunks);
      } else {
        console.log("MediaRecorder not recording");
      }
    },
    // 추가된 메소드: 녹화 중지 후 서버에 전송
    // stopAndSendRecording() {
    //   this.stopRecording()
    //     .then(async (blob) => {
    //       if (!(blob instanceof Blob)) {
    //         console.error("The recording did not produce a valid Blob object.");
    //         return;
    //       }

    //       const formData = new FormData();
    //       formData.append("videoFile", blob, "recording.mp4");

    //       const updatedReduxData = {
    //         ...reduxData,
    //         uid,
    //         channelName,
    //       };

    //       formData.append("reduxData", JSON.stringify(updatedReduxData));

    //       const uploadURL = `${serverAddress}/upload`; // URL에 슬래시(/)를 확인해 주세요.

    //       try {
    //         const response = await fetch(uploadURL, {
    //           method: "POST",
    //           body: formData,
    //         });
    //         if (!response.ok) {
    //           throw new Error("Network response was not ok");
    //         }
    //         const data = await response.json();
    //         console.log("Upload successful:", data);
    //       } catch (error) {
    //         console.error("Upload error:", error);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error in stopRecording:", error);
    //     });
    // },
  }));

  useEffect(() => {
    if (recordedChunks.length > 0) {
      // const blob = new Blob(recordedChunks, { type: "video/mp4" });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "recording.mp4";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
      // console.log("Recording downloaded:", url);
      // ref.current.stopAndSendRecording();
      console.log("이태휘");
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
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
        const response = fetch(uploadURL, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = response.json();
        console.log("Upload successful:", data);
      } catch (error) {
        console.error("Upload error:", error);
      }

      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return null;
});

export default VideoRecorder;
