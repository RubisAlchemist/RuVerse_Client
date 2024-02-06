// ConsultationButton.js
import React from "react";
import { Link } from "react-router-dom";

function StartButton() {
  return (
    <Link to="/permission" className="start-button">
      온라인 상담 시작하기!
    </Link>
  );
}

export default StartButton;
