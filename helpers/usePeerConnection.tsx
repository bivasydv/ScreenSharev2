import { useState, useEffect, useRef, useCallback } from "react";
import Peer, { MediaConnection, DataConnection } from "peerjs";

type ConnectionStatus =
  | "idle"
  | "initializing"
  | "ready"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export const usePeerConnection = (remotePeerIdToConnect?: string) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenOn, setIsScreenOn] = useState(false);

  const currentCallRef = useRef<MediaConnection | null>(null);
  const dataConnectionRef = useRef<DataConnection | null>(null);

  const cleanupStream = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const setupPeer = useCallback(async () => {
    setConnectionStatus("initializing");
    try {
      const newPeer = new Peer({
        // For production, you'd configure your own PeerJS server
        // host: 'your-peerjs-server.com',
        // port: 9000,
        // path: '/myapp'
      });

      newPeer.on("open", (id: string) => {
        console.log("PeerJS open, ID:", id);
        setPeerId(id);
        setPeer(newPeer);
        setConnectionStatus("ready");
        if (remotePeerIdToConnect) {
          connectToPeer(remotePeerIdToConnect, newPeer);
        }
      });

      newPeer.on("call", (call: MediaConnection) => {
        console.log("Incoming call");
        setConnectionStatus("connected");
        currentCallRef.current = call;
        call.answer(localStream || undefined); // Answer with local stream if available
        call.on("stream", (stream: MediaStream) => {
          console.log("Received remote stream");
          setRemoteStream(stream);
        });
        call.on("close", () => {
          console.log("Call closed");
          setConnectionStatus("disconnected");
          setRemoteStream(null);
        });
      });

      newPeer.on("connection", (conn: DataConnection) => {
        console.log("Incoming data connection");
        dataConnectionRef.current = conn;
        setConnectionStatus("connected");
        conn.on("close", () => {
          console.log("Data connection closed");
          setConnectionStatus("disconnected");
        });
      });

      newPeer.on("disconnected", () => {
        console.log("Peer disconnected");
        setConnectionStatus("disconnected");
        // Consider attempting to reconnect here
      });

      newPeer.on("error", (err: Error) => {
        console.error("PeerJS error:", err);
        setConnectionStatus("error");
      });
    } catch (error) {
      console.error("Failed to load or initialize PeerJS", error);
      setConnectionStatus("error");
    }
  }, [remotePeerIdToConnect, localStream]);

  const connectToPeer = (remoteId: string, peerInstance: Peer) => {
    console.log(`Connecting to peer: ${remoteId}`);
    setConnectionStatus("connecting");
    dataConnectionRef.current = peerInstance.connect(remoteId);
    dataConnectionRef.current.on("open", () => {
      console.log("Data connection established");
      setConnectionStatus("connected");
      // Now that data connection is open, we can initiate a call
      if (localStream) {
        const call = peerInstance.call(remoteId, localStream);
        currentCallRef.current = call;
        call.on("stream", (stream: MediaStream) => {
          console.log("Received remote stream on call");
          setRemoteStream(stream);
        });
        call.on("close", () => {
          console.log("Call closed by remote");
          setConnectionStatus("disconnected");
          setRemoteStream(null);
        });
      }

    });
  };

  useEffect(() => {
    setupPeer();
    return () => {
      console.log("Cleaning up peer connection");
      cleanupStream(localStream);
      cleanupStream(remoteStream);
      currentCallRef.current?.close();
      dataConnectionRef.current?.close();
      peer?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLocalStream = useCallback(
    async (mic: boolean, cam: boolean) => {
      cleanupStream(localStream);

      if (!mic && !cam) {
        setLocalStream(null);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: mic,
          video: cam,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error("Error getting user media:", err);
        // Revert state if permission is denied
        if (cam) setIsCameraOn(false);
        if (mic) setIsMicOn(true); // Keep mic on by default
      }
    },
    [localStream]
  );

  useEffect(() => {
    if (!isScreenOn) {
      updateLocalStream(isMicOn, isCameraOn);
    }
  }, [isMicOn, isCameraOn, isScreenOn, updateLocalStream]);

  useEffect(() => {
    if (localStream && currentCallRef.current) {
      const sender = currentCallRef.current.peerConnection
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender && localStream.getVideoTracks()[0]) {
        sender.replaceTrack(localStream.getVideoTracks()[0]);
      }
      const audioSender = currentCallRef.current.peerConnection
        .getSenders()
        .find((s) => s.track?.kind === "audio");
      if (audioSender && localStream.getAudioTracks()[0]) {
        audioSender.replaceTrack(localStream.getAudioTracks()[0]);
      }
    }
  }, [localStream]);

  const toggleMic = () => setIsMicOn((prev) => !prev);
  const toggleCamera = () => setIsCameraOn((prev) => !prev);

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // If user also wants mic audio
      if (isMicOn) {
        const voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        voiceStream
          .getAudioTracks()
          .forEach((track) => screenStream.addTrack(track));
      }

      cleanupStream(localStream);
      setLocalStream(screenStream);
      setIsScreenOn(true);

      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const stopScreenShare = () => {
    cleanupStream(localStream);
    setLocalStream(null);
    setIsScreenOn(false);
    // This will trigger the useEffect to get user media again
  };

  return {
    peerId,
    isPeerReady: connectionStatus === "ready" || connectionStatus === "connected",
    connectionStatus,
    localStream,
    remoteStream,
    isMicOn,
    isCameraOn,
    isScreenOn,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
};