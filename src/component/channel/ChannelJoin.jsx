import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCall } from "../../store/channel/channelSlice";
import { startCollecting } from "../../store/logger/loggerSlice";

const ChannelJoin = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.channel.name);
  const uid = useSelector((state) => state.channel.uid);

  const isRequirementsFulfilled = name.length !== 0 && uid.length !== 0;

  const handleJoin = () => {
    dispatch(startCollecting());
    dispatch(setCall());
  };

  return (
    <Button
      variant="contained"
      color="primary"
      style={{ marginTop: "20px" }}
      onClick={handleJoin}
      disabled={!isRequirementsFulfilled}
    >
      상담 시작하기
    </Button>
  );
};

export default ChannelJoin;
