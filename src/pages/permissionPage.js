// import {
//   notificationKind,
//   useSystemNotification,
// } from "../hooks/useSystemNotification";
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
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
// import {
//   setCameraPermission,
//   setDevicemotionPermission,
//   setLocationPermission,
//   setMicrophonePermission,
// } from "@store/actions";

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
  // const dispatch = useDispatch();
  const userAgent = getUserAgent();
  // const control = useSelector((state) => state.control);
  // const { onSendMessage } = useSystemNotification();
  const navigate = useNavigate();
  const [isGrantedPermission, setIsGrantedPermission] = useState({
    camera: false,
    location: false,
    microphone: false,
    devicemotion: false,
  });
  const [allPermissionIsReady, setAllPermissionIsReady] = useState(false);

  const onPermissionChange = (key, isGranted) => {
    setIsGrantedPermission((prev) => ({ ...prev, [key]: isGranted }));
  };

  const handleGPSPermissionForIOS = () => {
    onPermissionChange("location", true);
    // 필요한 다른 처리 또한 여기에 추가
  };

  useEffect(() => {
    const setGranted = async () => {
      const camera = await checkPermission("camera");
      const location = await checkPermission("geolocation");
      const microphone = await checkPermission("microphone");

      setIsGrantedPermission((prev) => ({
        ...prev,
        camera,
        location,
        microphone,
      }));
    };
    const interval = setInterval(() => {
      setGranted();
    }, 1200);
    // 15초 동안 권한체크를 모두 끝내지 못하면 다음으로 진행 가능
    setTimeout(() => {
      setAllPermissionIsReady(true);
    }, 15000);
    setGranted();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const agentFilter = Object.keys(isGrantedPermission).filter(
      (key) => !(userAgent !== "iOS" && key === "devicemotion")
    );
    const deninedLength = agentFilter.filter(
      (key) => !isGrantedPermission[key]
    ).length;
    // if (!deninedLength) {
    //   setCameraPermission();
    //   setMicrophonePermission();
    //   setLocationPermission();
    //   setDevicemotionPermission();
    //   setAllPermissionIsReady(true);
    //   // onSendMessage({
    //   //   notificationKind: notificationKind.QUIZSET_PERMISSION_STUDENT_READY,
    //   // });
    // }
  }, [
    isGrantedPermission,
    // onSendMessage,
    userAgent,
    // control.hasCameraPermission,
    // control.hasLocationPermission,
    // control.hasMicrophonePermission,
    // control.hasDevicemotionPermission,
  ]);

  return (
    <StyledContainer>
      <StyledTitle>
        포커스팡 이용을 진행하려면 아래 권한들이 필요해요.
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
                <Button
                  onClick={() => {
                    if (userAgent === "iOS" && permission.key === "location") {
                      handleGPSPermissionForIOS();
                    } else {
                      requestPermission(permission.key);
                    }
                  }}
                >
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
                <Button
                  onClick={() => {
                    requestPermission("devicemotion");
                    onPermissionChange("devicemotion", true);
                  }}
                >
                  권한 설정하기
                </Button>
              )}
            </StyledCheckWrap>
          </StyledPermission>
        )}
      </StyledPermissionWrap>
      <StyledButtonWrap>
        {allPermissionIsReady && (
          <Button
            onClick={() =>
              // 이전 페이지로 이동
              navigate("/postureCheck")
            }
          >
            다음으로 가기
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
`;
const StyledTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 28px;
`;
const StyledPermissionWrap = styled.div`
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 6px;
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
`;
const StyledButtonWrap = styled.div`
  margin-top: 20px;
`;
