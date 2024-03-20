import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const VideoRecorder = forwardRef((props, ref) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  // const videoRef = useRef(null);
  const serverAddress = process.env.REACT_APP_BACKEND_ADDRESS_DEV;

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
        mediaRecorder.stop();
        setRecording(false);
        console.log("Recording stopped");

        // 녹화 중지 후 recordedChunks를 기반으로 Blob 생성 후 반환
        return new Promise((resolve) => {
          mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
              const blob = new Blob(recordedChunks, { type: "video/mp4" });

              // FormData를 사용하여 서버로 파일 전송
              const formData = new FormData();
              formData.append("videoFile", blob, "recording.mp4");

              // 여기에 reduxData 추가
              if (props.reduxData) {
                formData.append("reduxData", JSON.stringify(props.reduxData));
              }

              const uploadURL = `${serverAddress}upload`;

              try {
                const response = await fetch(uploadURL, {
                  method: "POST",
                  body: formData,
                  // 추가적인 헤더가 필요할 수 있음
                });
                const data = await response.json();
                console.log("Upload successful:", data);
                resolve(blob); // blob 반환 대신 서버 응답을 반환할 수도 있습니다.
              } catch (error) {
                console.error("Upload error:", error);
                resolve(null);
              }
            }
          };

          // 데이터가 사용 가능하게 되었을 때 이벤트를 한 번만 처리하도록 설정
          mediaRecorder.dispatchEvent(new Event("dataavailable"));
        });
      } else {
        console.log("MediaRecorder not recording");
        return null;
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
  }));

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Recording downloaded:", url);

      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return null;
});

export default VideoRecorder;
