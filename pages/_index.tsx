import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ScreenShare, LogIn } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import styles from "./_index.module.css";

export default function HomePage() {
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate();

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      navigate(`/join/${joinId.trim()}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>PeerShare - Minimalist Screen Sharing</title>
        <meta
          name="description"
          content="Start sharing your screen or join a session instantly with our minimalist peer-to-peer platform."
        />
      </Helmet>
      <div className={styles.hero}>
        <h1 className={styles.title}>Instant, Secure Screen Sharing.</h1>
        <p className={styles.subtitle}>
          Peer-to-peer sharing directly from your browser. No installs, no
          accounts.
        </p>
        <div className={styles.actions}>
          <Button
            asChild
            size="lg"
            className={styles.actionButton}
          >
            <Link to="/host">
              <ScreenShare />
              Start Sharing
            </Link>
          </Button>
          <form
            onSubmit={handleJoinSession}
            className={styles.joinForm}
          >
            <Input
              type="text"
              placeholder="Enter Session ID to Join"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className={styles.joinInput}
              aria-label="Session ID"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={!joinId.trim()}
              className={styles.actionButton}
            >
              <LogIn />
              Join Session
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}