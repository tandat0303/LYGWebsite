import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../assets/lottie/app-loading.json";

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 150,
  fullScreen = false,
  overlay = false,
}) => {
  return (
    <div
      style={{
        position: fullScreen || overlay ? "fixed" : "relative",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: overlay ? "rgba(255,255,255,0.6)" : "#f0ede8",
        zIndex: 9999,
      }}
    >
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default Loading;
