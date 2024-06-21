import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React from "react";

const RecordErrorModal = ({
  open,
  onClose,
  videoError,
  screenError,
  agoraError,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5">녹화오류</Typography>
        <Divider />
        <Box p={2}>
          {videoError && (
            <Typography
              id="modal-modal-title"
              variant="caption"
              component="p"
              color="crimson"
            >
              비디오 녹화 오류: {videoError}
            </Typography>
          )}
          {screenError && (
            <Typography
              id="modal-modal-title"
              variant="caption"
              component="p"
              color="crimson"
            >
              화면 녹화 오류: {screenError}
            </Typography>
          )}
          {agoraError && (
            <Typography
              id="modal-modal-title"
              variant="caption"
              component="p"
              color="crimson"
            >
              아고라 녹화요청 실패: {agoraError}
            </Typography>
          )}
        </Box>
        <Typography variant="overline" color="crimson">
          녹화 버튼을 다시 눌러주세요.
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" onClick={onClose}>
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RecordErrorModal;
