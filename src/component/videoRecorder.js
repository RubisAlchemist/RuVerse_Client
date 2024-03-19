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
    stopAndDownloadRecording() {
      // console.log('Attempting to stop and download recording');
      // console.log(mediaRecorder);
      // console.log(mediaRecorder.state);
      console.log("1: ", recordedChunks);
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        setRecording(false);
        if (recordedChunks.length > 0) {
          console.log("check here2");
          const blob = new Blob(recordedChunks, { type: "video/mp4" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "recording.mp4"; // 파일 이름
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log("Recording download URL:", url);
        }
        console.log("Recording stopped");

        console.log("2: ", recordedChunks);
      } else {
        console.log("MediaRecorder not recording");
      }
    },
  }));

  // useEffect(() => {
  //   if (recordedChunks.length > 0) {
  //     const blob = new Blob(recordedChunks, { type: "video/mp4" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "recording.mp4";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //     console.log("Recording downloaded:", url);

  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  return null;
});

export default VideoRecorder;
