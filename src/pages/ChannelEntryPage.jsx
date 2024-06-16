import { Box, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import JoinButton from "../component/channel/JoinButton";
import JoinForm from "../component/form/JoinForm";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { useSelector } from "react-redux";

const ChannelEntryPage = () => {
  const navigate = useNavigate();
  const { handleGps } = useCurrentLocation();

  const uid = useSelector((state) => state.channel.uid.value);
  const cname = useSelector((state) => state.channel.name.value);

  const handleJoin = () => {
    handleGps();
    navigate(`/channel/${cname}/${uid}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        border: "1px solid blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <JoinForm />
        <JoinButton onClick={handleJoin} />
      </Stack>
    </Box>
  );
};

export default ChannelEntryPage;
