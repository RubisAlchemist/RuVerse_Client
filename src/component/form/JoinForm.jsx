import {
  Box,
  Button,
  Card,
  CardMedia,
  Stack,
  TextField,
  Container,
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
import { setGps } from "../../store/logger/loggerSlice";

function JoinForm() {
  const uid = useSelector((state) => state.channel.uid.value);
  const isUidError = useSelector((state) => state.channel.uid.isError);
  const channelName = useSelector((state) => state.channel.name.value);
  const isChannelNameError = useSelector((state) => state.channel.name.isError);

  const dispatch = useDispatch();

  const { location, error } = useCurrentLocation();

  const handleJoin = () => {
    // webgazer.begin();
    dispatch(setCall());
    dispatch(setGps(location));
  };

  return (
    <Container maxWidth="md" className="responsive-container">
      <Stack spacing={2} alignItems="center">
        <Card>
          <CardMedia component="img" image={VideoCallImage} />
        </Card>

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
          helperText={
            isChannelNameError ? "상담소명은 영문, 숫자만 가능합니다." : ""
          }
          inputProps={{
            pattern: "[a-zA-Z0-9]+",
          }}
          sx={{ width: "60%" }}
        />
        <TextField
          required
          error={isUidError}
          label="유저 이름"
          value={uid}
          helperText={isUidError ? "유저 이름은 영문, 숫자만 가능합니다." : ""}
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
            pattern: "[a-zA-Z0-9]+",
          }}
          sx={{ width: "60%" }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            disabled={isUidError || isChannelNameError}
          >
            상담 시작하기
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default JoinForm;
