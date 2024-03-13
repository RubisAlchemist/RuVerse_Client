import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  CameraAlt,
  Check,
  LocationOn,
  Mic,
  Vibration,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { checkPermission, requestPermission } from "../utils/permissions";
import { getUserAgent } from "../utils/userAgent";

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

function PermissionPage() {
  const navigate = useNavigate();
  const userAgent = getUserAgent();
  const [isGrantedPermission, setIsGrantedPermission] = useState({
    camera: false,
    location: false,
    microphone: false,
    devicemotion: false,
  });
  const [allPermissionIsReady, setAllPermissionIsReady] = useState(false);

  useEffect(() => {
    const setGranted = async () => {
      const camera = await checkPermission("camera");
      const location = await checkPermission("geolocation");
      const microphone = await checkPermission("microphone");

      setIsGrantedPermission({
        camera,
        location,
        microphone,
      });
    };

    setGranted();

    const interval = setInterval(() => {
      setGranted();
    }, 1200);

    setTimeout(() => {
      setAllPermissionIsReady(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handlePermissionRequest = (key) => {
    if (userAgent === "iOS" && key === "location") {
      setIsGrantedPermission((prev) => ({ ...prev, [key]: true }));
      // handleGPSPermissionForIOS();
    } else {
      requestPermission(key);
      setIsGrantedPermission((prev) => ({ ...prev, [key]: true }));
    }
  };

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
            <StyledCheckWrap>
              {isGrantedPermission[permission.key] ? (
                <Check />
              ) : (
                <Button onClick={() => handlePermissionRequest(permission.key)}>
                  권한 설정하기
                </Button>
              )}
            </StyledCheckWrap>
          </StyledPermission>
        ))}
        {userAgent === "iOS" && (
          <StyledPermission>
            <StyledName>
              <Vibration /> 디바이스 모션 권한
            </StyledName>
            <StyledCheckWrap>
              {isGrantedPermission.devicemotion ? (
                <Check />
              ) : (
                <Button onClick={() => handlePermissionRequest("devicemotion")}>
                  권한 설정하기
                </Button>
              )}
            </StyledCheckWrap>
          </StyledPermission>
        )}
      </StyledPermissionWrap>
      <StyledButtonWrap>
        {allPermissionIsReady && (
          <Button onClick={() => navigate("/videocallPage")}>
            온라인 상담하러 가기
          </Button>
        )}
      </StyledButtonWrap>
    </StyledContainer>
  );
}

export default PermissionPage;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  width: 100%;
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
