// EyetrackingContext.js
import React from "react";

const EyetrackingContext = React.createContext({
  gazeData: { x: 0, y: 0 },
  setGazeData: () => {},
  isWebgazerInitialized: false,
});

export default EyetrackingContext;
