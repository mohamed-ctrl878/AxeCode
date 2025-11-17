import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = "6bde9444bb154743949a94a0300fef4b";
const channel = "testChannel"; // اسم الغرفة أو القناة
const token = null; // نستخدم null في وضع التطوير بدون حماية

export default function LiveStream() {
  const localContainer = useRef(null);

  useEffect(() => {
    const init = async () => {
      const client = AgoraRTC.createClient({
        mode: "rtc", // ✅ بدلاً من "live"
        codec: "vp8",
      });
      await client.join(appId, channel, token, null);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(() => console.log("✅ تم الوصول إلى الكاميرا"))
        .catch((err) => console.error("❌ لا يمكن الوصول إلى الكاميرا:", err));

      const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTrack[1].play(localContainer.current);

      await client.publish(localTrack);
      console.log("🎥 بث مباشر بدأ!");
    };

    init();
  }, []);

  return (
    <div>
      <h2>🎬 البث المباشر قيد التشغيل</h2>
      <div
        ref={localContainer}
        style={{ width: "640px", height: "360px", background: "#000" }}
      ></div>
    </div>
  );
}
