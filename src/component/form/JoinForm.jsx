import { Box, Container, Stack, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./joinForm.css";

import VideoCallImage from "../../images/videocallImage.png";
import {
  onChangeChannelName,
  onChangeUid,
} from "../../store/channel/channelSlice";

function JoinForm() {
  const uid = useSelector((state) => state.channel.uid.value);
  const isUidError = useSelector((state) => state.channel.uid.isError);
  const channelName = useSelector((state) => state.channel.name.value);
  const isChannelNameError = useSelector((state) => state.channel.name.isError);

  const dispatch = useDispatch();

  return (
    <Container maxWidth="md" className="responsive-container">
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <TextField
            required
            fullWidth
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
              isChannelNameError ? "상담소명은 영문과 숫자만 가능합니다." : ""
            }
            inputProps={{
              pattern: "[a-zA-Z0-9]+",
            }}
            sx={{ width: "60%", marginBottom: "12px" }}
          />

          <TextField
            required
            error={isUidError}
            label="유저 이름"
            value={uid}
            helperText={isUidError ? "유저 이름은 숫자만 가능합니다." : ""}
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
              pattern: "[0-9]+",
            }}
            sx={{ width: "60%" }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "360px", md: "500px" },
            height: { xs: "360px", md: "500px" },
          }}
        >
          <img
            src={VideoCallImage}
            alt=""
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </Box>
      </Stack>
    </Container>
  );
}

export default JoinForm;
