import React, { FC } from "react";
import Beams from "./Beams";
import useDarkMode from "@hooks/useToggleDarkMode";

import styles from "./style.module.scss";

type Props = {
  className?: string;
};

const DarkModeToggle: FC<Props> = ({ className }) => {
  const [currentMode, setMode] = useDarkMode();

  const toggleMode = () => {
    setMode(currentMode === "dark" ? "light" : "dark");
  };
  return (
    <button
      className={`${styles.outerSlider} ${className}`}
      onClick={toggleMode}
    >
      <div className={`${styles.innerSlider} ${styles[currentMode]}`}>
        <div className={styles.colorFill} />
        <Beams className={styles.beam} color={"var(--textColor)"} />
      </div>
    </button>
  );
};

export default DarkModeToggle;
