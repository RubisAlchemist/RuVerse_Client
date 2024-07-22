import { Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ChannelLeave = ({ onClick }) => {
  const dispatch = useDispatch();

  /*
  
  // 녹화 업로드 성공한 경우 나가기 버튼 활성화
  const isSuccessUpload = useSelector(
    (state) => state.upload.status.UPLOAD_SUCCESS
  );
  */

  return (
    <Button
      onClick={onClick}
      color="info"
      // disabled={!isSuccessUpload}
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
        상담 끝내기
      </Typography>
    </Button>
  );
};

export default ChannelLeave;
