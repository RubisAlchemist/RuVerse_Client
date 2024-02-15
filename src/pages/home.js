// Home.js
import React from "react";
// import StartButton from "../component/startButton";
import styled from "styled-components";
import { Button } from "@mui/material";
import postureImg from "../images/caliImage.png";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <StyledReady>
        <h1>환영합니다!</h1>
        <StyledImg src={postureImg} />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            navigate("/permission");
          }}
        >
          권한 설정 하러가기
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
