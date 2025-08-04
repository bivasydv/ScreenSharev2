import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Maximize, Minimize } from "lucide-react";
import { usePeerConnection } from "../helpers/usePeerConnection";
import { VideoPlayer } from "../components/VideoPlayer";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/Button";
import styles from "./join.$peerId.module.css";

export default function JoinPage() {
  const { peerId: remotePeerId } = useParams<{ peerId: string }>();
  const { remoteStream, connectionStatus } = usePeerConnection(remotePeerId);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <Helmet>
        <title>Joining Session | PeerShare</title>
        <meta
          name="description"
          content="Joining a screen sharing session."
        />
      </Helmet>
      <div className={styles.container} ref={videoContainerRef}>
        <header className={styles.header}>
          <StatusBadge status={connectionStatus} />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullScreen}
            className={styles.fullscreenButton}
            aria-label="Toggle Fullscreen"
          >
            {document.fullscreenElement ? (
              <Minimize size={20} />
            ) : (
              <Maximize size={20} />
            )}
          </Button>
        </header>

        <main className={styles.mainContent}>
          {remoteStream ? (
            <VideoPlayer stream={remoteStream} />
          ) : (
            <div className={styles.placeholder}>
              <p>
                {connectionStatus === "connecting"
                  ? "Connecting to host..."
                  : "Waiting for host to start sharing..."}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}