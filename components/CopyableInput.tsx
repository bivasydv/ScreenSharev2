import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./CopyableInput.module.css";

interface CopyableInputProps {
  value: string;
}

export const CopyableInput = ({ value }: CopyableInputProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={styles.container}>
      <Input
        type="text"
        value={value}
        readOnly
        className={styles.input}
        aria-label="Shareable Link"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className={styles.button}
        aria-label="Copy to clipboard"
      >
        {isCopied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
      </Button>
    </div>
  );
};