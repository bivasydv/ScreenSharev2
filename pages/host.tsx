import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { usePeerConnection } from "../helpers/usePeerConnection";
import { VideoPlayer } from "../components/VideoPlayer";
import { ControlBar } from "../components/ControlBar";
import { StatusBadge } from "../components/StatusBadge";
import { CopyableInput } from "../components/CopyableInput";
import styles from "./host.module.css";

export default function HostPage() {
  const {
    peerId,
    isPeerReady,
    connectionStatus,
    localStream,
    isCameraOn,
    isMicOn,
    isScreenOn,
    toggleCamera,
    toggleMic,
    startScreenShare,
    stopScreenShare,
  } = usePeerConnection();

  const shareableLink =
    typeof window !== "undefined" && peerId
      ? `${window.location.origin}/join/${peerId}`
      : "";

  return (
    <>
      <Helmet>
        <title>Host Session | PeerShare</title>
        <meta name="description" content="Host a screen sharing session." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Hosting Session</h1>
          <div className={styles.statusContainer}>
            <StatusBadge status={connectionStatus} />
            {isPeerReady && peerId && (
              <CopyableInput value={shareableLink} />
            )}
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.videoArea}>
            {localStream ? (
              <VideoPlayer stream={localStream} isMuted={true} />
            ) : (
              <div className={styles.placeholder}>
                <p>Your video preview will appear here.</p>
                <p>
                  Use the controls below to start your camera or share your
                  screen.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <ControlBar
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isScreenOn={isScreenOn}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMic}
            onToggleScreenShare={isScreenOn ? stopScreenShare : startScreenShare}
          />
        </footer>
      </div>
    </>
  );
}