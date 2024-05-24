import { useContext } from "react";
import { AgoraContext } from "./agora-context";

export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context)
    throw new Error("useAgoraContext must be used within an AgoraProvider");
  return context;
};
