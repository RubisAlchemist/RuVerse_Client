import { Box } from "@mui/material";
import React from "react";
import AudioRecorder from "../component/AudioRecorder";
import LocalUser from "../component/LocalUser";
import { RecordProvider } from "../context/record/record-context";
import useRecordClient from "../hooks/record/useRecordClient";
import ChannelLeave from "../component/channel/ChannelLeave";
import { useNavigate } from "react-router-dom";

function VideoInteractPage() {
  const client = useRecordClient();

  const navigate = useNavigate();

  const onChannelLeave = () => navigate("/");

  return (
    <RecordProvider value={client}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        {/* remote user */}
        <Box
          sx={{
            width: "100%",
            height: "90%",
            border: "3px solid black",
          }}
        ></Box>

        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0 + "10%",
            backgroundColor: "blue",
            width: { xs: "200px", md: "320px" },
            height: { xs: "120px", md: "200px" },
          }}
        >
          <LocalUser />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10%",
            border: "1px solid black",
          }}
        >
          <ChannelLeave onClick={onChannelLeave} />
          <AudioRecorder />
        </Box>
      </Box>
    </RecordProvider>
  );
}

export default VideoInteractPage;
