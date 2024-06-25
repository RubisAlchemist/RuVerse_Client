import VirtualBackgroundExtension from "agora-extension-virtual-background";
import AgoraRTC, { RemoteUser } from "agora-rtc-react";
import React, { useEffect, useRef } from "react";
import remoteBackgroundImage from "../../assets/base-img.png";
import wasm from "../../wasms/agora-wasm.wasm?url";
const RemoteUserWrapper = ({ user }) => {
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef();

  const checkCompatibility = () => {
    if (!extension.current.checkCompatibility()) {
      console.error("Virtual background not supported on this platform.");
    }
  };

  useEffect(() => {
    console.log("[VIRTUAL BACKGROUND MANAGER]");

    console.log(user._videoTrack);
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      checkCompatibility();

      if (user.videoTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          await processor.current.init(wasm);
          user.videoTrack
            .pipe(processor.current)
            .pipe(user.videoTrack.processorDestination);
          const img = new Image();
          img.onload = () => {
            console.log("Image loaded successfully");
            processor.current?.setOptions({ type: "img", source: img });
          };
          img.onerror = (error) => {
            console.error("Error loading image:", error);
          };
          img.src = remoteBackgroundImage;

          await processor.current.enable();
        } catch (error) {
          console.error("Error initializing virtual background:", error);
        }
      }
    };

    if (user.hasVideo) {
      void initializeVirtualBackgroundProcessor();
    }

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        user.videoTrack?.unpipe();
        await processor.current?.disable();
      };
      void disableVirtualBackground();
    };
  }, [user, user.hasVideo, user.videoTrack]);

  return <RemoteUser user={user} playVideo playAudio autoPlay={true} />;
};

export default RemoteUserWrapper;
