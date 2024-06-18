import VirtualBackgroundExtension from "agora-extension-virtual-background";
import wasm from "../../wasms/agora-wasm.wasm?url";
import AgoraRTC, { useConnectionState } from "agora-rtc-react";
import React, { useEffect, useRef, useState } from "react";
import demoImage from "../../assets/image.webp";
import { useAgoraContext } from "../../context/useAgoraContext";
import { Button, Typography } from "@mui/material";

const VirtualBackground = () => {
  const connectionState = useConnectionState();
  const [isVirtualBackground, setVirtualBackground] = useState(false);

  return (
    <>
      {isVirtualBackground ? (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setVirtualBackground(false)}
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
              가상화면 끄기
            </Typography>
          </Button>
          <AgoraExtensionComponent />
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: "80px", md: "100px", lg: "120px" },
            height: { xs: "30px", md: "40px", lg: "50px" },
          }}
          onClick={() => setVirtualBackground(true)}
          disabled={connectionState !== "CONNECTED"}
        >
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            가상화면
          </Typography>
        </Button>
      )}
    </>
  );
};

function AgoraExtensionComponent() {
  const connectionState = useConnectionState();
  const agoraContext = useAgoraContext();

  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef();

  const [selectedOption, setSelectedOption] = useState("");
  const [customImage, setCustomImage] = useState(null);

  const checkCompatibility = () => {
    if (!extension.current.checkCompatibility()) {
      console.error("Virtual background not supported on this platform.");
    }
  };

  const colorBackground = () => {
    processor.current?.setOptions({ type: "color", color: "#00ff00" });
  };

  const imageBackground = (imageFile) => {
    console.log("Setting image background with image:", imageFile);
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully");
      processor.current?.setOptions({ type: "img", source: img });
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.src = URL.createObjectURL(imageFile);
  };

  const blurBackground = () => {
    processor.current?.setOptions({ type: "blur", blurDegree: 2 });
  };

  useEffect(() => {
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      checkCompatibility();

      if (agoraContext.localCameraTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          await processor.current.init(wasm);
          agoraContext.localCameraTrack
            .pipe(processor.current)
            .pipe(agoraContext.localCameraTrack.processorDestination);
          processor.current.setOptions({ type: "color", color: "#00ff00" });
          await processor.current.enable();
          setSelectedOption("color");
        } catch (error) {
          console.error("Error initializing virtual background:", error);
        }
      }
    };

    void initializeVirtualBackgroundProcessor();

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        agoraContext.localCameraTrack?.unpipe();
        await processor.current?.disable();
      };
      void disableVirtualBackground();
    };
  }, [agoraContext.localCameraTrack]);

  const changeBackground = (selectedOption) => {
    console.log("Selected background option:", selectedOption);
    if (!processor.current) {
      console.error("Virtual background processor not initialized");
      return;
    }

    switch (selectedOption) {
      case "color":
        setSelectedOption(selectedOption);
        colorBackground();
        break;
      case "blur":
        setSelectedOption(selectedOption);
        blurBackground();
        break;
      case "image":
        setSelectedOption(selectedOption);
        if (customImage) {
          imageBackground(customImage);
        } else {
          console.error("No custom image selected");
        }
        break;
      default:
        console.error("Invalid option:", selectedOption);
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Image uploaded:", file);
      setCustomImage(file);
      if (selectedOption === "image") {
        imageBackground(file);
      }
    }
  };

  return (
    <div>
      <select
        value={selectedOption}
        onChange={(event) => {
          setSelectedOption(event.target.value);
          changeBackground(event.target.value);
        }}
        disabled={connectionState === "DISCONNECTED"}
      >
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image">Image</option>
      </select>
      {selectedOption === "image" && (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}
    </div>
  );
}

export default VirtualBackground;
