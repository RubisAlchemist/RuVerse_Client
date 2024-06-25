import VirtualBackgroundExtension from "agora-extension-virtual-background";
import AgoraRTC, { LocalVideoTrack } from "agora-rtc-react";
import React, { useEffect, useRef } from "react";
import remoteBackgroundImage from "../../assets/base-img.png";
import wasm from "../../wasms/agora-wasm.wasm?url";

const LocalUserWrapper = ({ localCameraTrack }) => {
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef();

  const checkCompatibility = () => {
    if (!extension.current.checkCompatibility()) {
      console.error("Virtual background not supported on this platform.");
    }
  };

  useEffect(() => {
    console.log("[VIRTUAL BACKGROUND MANAGER]");

    console.log(localCameraTrack.videoTrack);
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      checkCompatibility();

      if (localCameraTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          await processor.current.init(wasm);
          localCameraTrack
            .pipe(processor.current)
            .pipe(localCameraTrack.processorDestination);
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

    void initializeVirtualBackgroundProcessor();

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        localCameraTrack?.unpipe();
        await processor.current?.disable();
      };
      void disableVirtualBackground();
    };
  }, [localCameraTrack]);

  return (
    <LocalVideoTrack track={localCameraTrack} play={true} autoPlay={true} />
  );
};

export default LocalUserWrapper;
