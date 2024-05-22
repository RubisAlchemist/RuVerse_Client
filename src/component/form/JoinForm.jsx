import {
  Box,
  Button,
  Container,
  ImageList,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import "./joinForm.css";

import VideoCallImage from "../../images/videocallImage.png";
import {
  onChangeChannelName,
  onChangeUid,
  setCall,
} from "../../store/channel/channelSlice";

function JoinForm() {
  const uid = useSelector((state) => state.channel.uid.value);
  const isUidError = useSelector((state) => state.channel.uid.isError);
  const channelName = useSelector((state) => state.channel.name.value);
  const isChannelNameError = useSelector((state) => state.channel.name.isError);

  const dispatch = useDispatch();

  const { handleGps } = useCurrentLocation();

  /**
   * webgazer 현재 보류중
   */
  const handleJoin = () => {
    // webgazer.begin();
    handleGps();
    dispatch(setCall());
  };

  return (
    <Container maxWidth="md" className="responsive-container">
      <Stack spacing={2} alignItems="center">
        <TextField
          required
          error={isChannelNameError}
          label="상담소명"
          value={channelName}
          onChange={(e) =>
            dispatch(
              onChangeChannelName({
                value: e.target.value,
                valid: e.target.validity.valid,
              })
            )
          }
          helperText={isChannelNameError ? "상담소명은 영문만 가능합니다." : ""}
          inputProps={{
            pattern: "[a-zA-Z]+",
          }}
          sx={{ width: "60%" }}
        />

        <TextField
          required
          error={isUidError}
          label="유저 이름"
          value={uid}
          helperText={isUidError ? "유저 이름은 영문만 가능합니다." : ""}
          onChange={(e) => {
            console.log(e.target.validity);
            dispatch(
              onChangeUid({
                value: e.target.value,
                valid: e.target.validity.valid,
              })
            );
          }}
          inputProps={{
            pattern: "[a-zA-Z]+",
          }}
          sx={{ width: "60%" }}
        />
        <ImageList cols={1}>
          <img src={VideoCallImage} alt="" style={{ objectFit: "cover" }} />
        </ImageList>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            disabled={
              uid === "" ||
              channelName === "" ||
              isUidError ||
              isChannelNameError
            }
          >
            상담 시작하기
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default JoinForm;
