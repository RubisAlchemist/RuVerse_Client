import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unSetCall } from "../../store/channel/channelSlice";
import {
  resetLogger,
  stopCollecting,
  stopGps,
} from "../../store/logger/loggerSlice";

const ChannelLeave = () => {
  const dispatch = useDispatch();
  const isSuccessUpload = useSelector(
    (state) => state.recorder.upload.UPLOAD_SUCCESS
  );
  const logger = useSelector((state) => state.logger);
  /**
   * 채널 나가기
   */
  const handleLeave = async () => {
    console.log(logger);
    dispatch(unSetCall());
    dispatch(resetLogger());
    dispatch(stopGps());
    dispatch(stopCollecting());
  };

  return <Button onClick={handleLeave}>채널 나가기</Button>;
};

export default ChannelLeave;
