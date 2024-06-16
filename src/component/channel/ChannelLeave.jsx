import { Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unSetCall } from "../../store/channel/channelSlice";
import { resetLogger } from "../../store/logger/loggerSlice";
import { resetUpload } from "../../store/upload/uploadSlice";
import webgazer from "webgazer";

const ChannelLeave = () => {
  const dispatch = useDispatch();

  // 녹화 업로드 성공한 경우 나가기 버튼 활성화
  const isSuccessUpload = useSelector(
    (state) => state.upload.status.UPLOAD_SUCCESS
  );

  /**
   * 채널 나가기
   * 로거, 업로드 스토어 초기화
   */
  const handleLeave = () => {
    webgazer.end();

    dispatch(resetLogger());
    dispatch(resetUpload());
    dispatch(unSetCall());
  };

  return (
    <Button
      onClick={handleLeave}
      disabled={!isSuccessUpload}
      sx={{
        width: { xs: "80px", md: "100px", lg: "120px" },
        height: { xs: "30px", md: "40px", lg: "50px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "12px", md: "16px", lg: "18px" },
        }}
      >
        채널 나가기
      </Typography>
    </Button>
  );
};

export default ChannelLeave;
