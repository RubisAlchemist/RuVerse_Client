import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY; // .env 파일 또는 환경 변수에서 Agora App ID

function Leave() {
  const channel = useSelector((state) => ({ ...state.channel }));
  const dispatch = useDispatch();

  return (
    <Button onClick={handleLeave} variant="contained" color="primary">
      상담 끝내기
    </Button>
  );
}

export default Leave;
