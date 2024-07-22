import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

const InfoModal = ({ open, isError, isSuccess, message, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isError && (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              업로드 실패
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {message}
            </Typography>
          </>
        )}
        {isSuccess && (
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              업로드 성공
            </Typography>
          </Box>
        )}
        <Button onClick={onClose}>모달 닫기</Button>
      </Box>
    </Modal>
  );
};

const style = {
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
};

export default InfoModal;
