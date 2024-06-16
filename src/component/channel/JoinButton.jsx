import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const JoinButton = ({ onClick }) => {
  const uid = useSelector((state) => state.channel.uid.value);
  const isUidError = useSelector((state) => state.channel.uid.isError);
  const channelName = useSelector((state) => state.channel.name.value);
  const isChannelNameError = useSelector((state) => state.channel.name.isError);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={
        uid === "" || channelName === "" || isUidError || isChannelNameError
      }
    >
      상담 시작하기
    </Button>
  );
};

export default JoinButton;
