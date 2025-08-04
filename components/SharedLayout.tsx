import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import styles from "./SharedLayout.module.css";

interface SharedLayoutProps {
  children: React.ReactNode;
}

export const SharedLayout = ({ children }: SharedLayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <Share2 size={24} />
          <h1>PeerShare</h1>
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};