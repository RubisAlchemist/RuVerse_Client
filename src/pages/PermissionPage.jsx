import { CameraAlt, LocationOn, Mic } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function PermissionPage() {
  const navigate = useNavigate();

  const PERMISSION = [
    {
      key: "camera",
      icon: <CameraAlt />,
      name: "카메라",
    },
    {
      key: "location",
      icon: <LocationOn />,
      name: "GPS",
    },
    {
      key: "microphone",
      icon: <Mic />,
      name: "마이크",
    },
  ];

  const handleNavigate = () => navigate("/videocallPage");

  return (
    <StyledContainer>
      <StyledTitle>
        RuVerse 이용을 진행하려면 아래 권한들이 필요해요.
      </StyledTitle>
      <StyledPermissionWrap>
        {PERMISSION.map((permission) => (
          <StyledPermission key={permission.key}>
            <StyledName>
              {permission.icon} {permission.name} 권한
            </StyledName>
          </StyledPermission>
        ))}
      </StyledPermissionWrap>
      <StyledButtonWrap>
        <Button onClick={handleNavigate}>온라인 상담하러 가기</Button>
      </StyledButtonWrap>
    </StyledContainer>
  );
}

export default PermissionPage;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  padding: 20px;
  width: 100%;
  height: 100vh;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledPermissionWrap = styled.div`
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 6px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledPermission = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 12px;
  }
`;

const StyledName = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 12px;
  }
`;

const StyledCheckWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 37px;
  color: #0ba1ae;

  @media (max-width: 768px) {
    width: 80px;
    height: 35px;
  }
`;

const StyledButtonWrap = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;
