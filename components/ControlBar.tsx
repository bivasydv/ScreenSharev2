import React from "react";
import { Mic, MicOff, Video, VideoOff, ScreenShare, StopCircle } from "lucide-react";
import { Button } from "./Button";
import styles from "./ControlBar.module.css";

interface ControlBarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
}

export const ControlBar = ({
  isMicOn,
  isCameraOn,
  isScreenOn,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
}: ControlBarProps) => {
  return (
    <div className={styles.container}>
      <Button
        size="icon-lg"
        variant={isMicOn ? "secondary" : "destructive"}
        onClick={onToggleMic}
        aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </Button>
      <Button
        size="icon-lg"
        variant={isCameraOn ? "secondary" : "outline"}
        onClick={onToggleCamera}
        aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
        disabled={isScreenOn}
      >
        {isCameraOn ? <Video /> : <VideoOff />}
      </Button>
      <Button
        size="lg"
        variant={isScreenOn ? "destructive" : "primary"}
        onClick={onToggleScreenShare}
      >
        {isScreenOn ? <StopCircle /> : <ScreenShare />}
        {isScreenOn ? "Stop Sharing" : "Share Screen"}
      </Button>
    </div>
  );
};