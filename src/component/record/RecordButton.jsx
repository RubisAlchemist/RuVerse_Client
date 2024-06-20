import { Button, Typography } from "@mui/material";
import React from "react";

const RecordButton = ({ variant, color, children, onClick }) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{
        width: { xs: "80px", md: "100px", lg: "120px" },
        height: { xs: "30px", md: "40px", lg: "50px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "12px", md: "16px", lg: "18px" },
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};

export default RecordButton;
