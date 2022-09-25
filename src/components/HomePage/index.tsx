import { FC, useState } from "react";
import DarkModeToggle from "@components/DarkModeToggle";
import axios from "axios";

import styles from "./style.module.scss";
import { MapRequest } from "src/types/requests";

const HomePage: FC = () => {
  const [input, setInput] = useState("");

  const sendReq = async () => {
    const reqBody: MapRequest = {
      maps: input.split(/\s*[\s,]\s*/),
      isSetId: false,
    };
    const res = await axios.post<MapRequest, any>("/api/submit", reqBody);
    const blob = new Blob([res.data], { type: "application/zip" });
    var url = window.URL.createObjectURL(blob);
    let tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", "filename.zip");
    tempLink.click();
  };

  return (
    <div className={styles.home}>
      <DarkModeToggle />

      <textarea
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Enter mapset IDs with white space"
      />
      <button className={styles.submit} onClick={sendReq}>
        Send
      </button>
    </div>
  );
};
export default HomePage;
