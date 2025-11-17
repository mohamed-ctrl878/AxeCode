import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = "6bde9444bb154743949a94a0300fef4b";
const channel = "testChannel";
const token = null;

export default function LiveViewer() {
  const remoteContainer = useRef(null);

  useEffect(() => {
    const init = async () => {
      const client = AgoraRTC.createClient({
        mode: "rtc", // ✅ بدلاً من "live"
        codec: "vp8",
      });
      await client.join(appId, channel, token, null);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          user.videoTrack.play(remoteContainer.current);
        }
      });
    };

    init();
  }, []);

  return (
    <div>
      <h2>👀 المشاهدة المباشرة</h2>
      <div
        ref={remoteContainer}
        style={{ width: "640px", height: "360px", background: "#000" }}
      ></div>
    </div>
  );
}
