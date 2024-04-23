import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import postureImg from "../images/permissionCheckImage.png";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <StyledReady>
        <StyledHeading>환영합니다!</StyledHeading>
        <StyledImg src={postureImg} />
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/permission");
          }}
        >
          권한 설정 하러가기
        </StyledButton>
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
`;

const StyledHeading = styled.h1`
  font-size: calc(16px + 2vmin); // 화면 크기에 따라 글자 크기 조절

  @media (max-width: 768px) {
    font-size: calc(15px + 2vmin); // 더 작은 화면에서의 조절
  }
`;

const StyledImg = styled.img`
  width: 40%;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  font-size: calc(10px + 1vmin); // 화면 크기에 따라 버튼 내 글자 크기 조절

  @media (max-width: 768px) {
    padding: 6px 12px; // 더 작은 화면에서의 버튼 패딩 조절
  }
`;
