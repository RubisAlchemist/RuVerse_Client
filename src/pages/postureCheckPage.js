import React, { useEffect, useState } from "react";
import styled from "styled-components";
import postureImg from "../images/caliImage.png";
import { Button } from "@mui/material";
// import QuizReadyCalib from "./quiz-ready-calib";
import { useParams } from "react-router-dom";
import EyetrackerInit from "./eyetrackerInit";
import { useNavigate } from "react-router-dom";
// import {
//   notificationKind,
//   useSystemNotification,
// } from "hooks/useSystemNotification";

export const PostureCheckPage = () => {
  //   const { onSendMessage } = useSystemNotification();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [openCalibration, setOpenCalibration] = useState(true);
  const [isCalibrationComplete, setIsCalibrationComplete] = useState(false);

  //   useEffect(() => {
  //     onSendMessage({
  //       notificationKind: notificationKind.QUIZSET_STUDENT_STATUS,
  //       payload: "READY_INPROGRESS",
  //     });
  //   }, [onSendMessage]);

  //   useEffect(() => {
  //     if (isCalibrationComplete) {
  //       onSendMessage({
  //         notificationKind: notificationKind.QUIZSET_STUDENT_STATUS,
  //         payload: "READY_SUCCESS",
  //       });
  //     }
  //   }, [isCalibrationComplete, onSendMessage]);

  if (!openCalibration) {
    return (
      <StyledContainer>
        <EyetrackerInit
          groupId={groupId}
          onSuccess={setOpenCalibration}
          setIsCalibrationComplete={setIsCalibrationComplete}
        />
      </StyledContainer>
    );
  }

  if (isCalibrationComplete) {
    return (
      <StyledContainer>
        <StyledReady>
          <h1>자세 체크가 완료되었습니다!</h1>
          <StyledImg src={postureImg} />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              navigate("/videocallPage");
            }}
          >
            온라인회의하러가기
          </Button>
        </StyledReady>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledReady>
        <h1>자세를 확인해주세요!</h1>
        <StyledImg src={postureImg} />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            setOpenCalibration(false);
          }}
        >
          자세 체크 시작하기
        </Button>
      </StyledReady>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;
const StyledReady = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8;
  font-size: 15px;
`;

const StyledImg = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
`;
