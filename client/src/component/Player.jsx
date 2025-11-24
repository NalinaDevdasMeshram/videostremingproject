import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Player({ src, sync, socket, index }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState("init");

  // --------------------------
  // Initialize HLS video
  // --------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        maxBufferLength: 30,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus("ready");
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error", event, data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () =>
        video.play().catch(() => {})
      );
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // --------------------------
  // Sync logic using socket
  // --------------------------
  useEffect(() => {
    if (!socket) return;

    let lastNudge = 0;

    function correctPlayback(video, delta) {
      if (Math.abs(delta) > 0.25) {
        video.currentTime = video.currentTime + delta;
      } else {
        const now = Date.now();
        if (now - lastNudge < 1000) return;
        lastNudge = now;

        const rate = 1 + delta * 0.2;
        video.playbackRate = Math.max(0.8, Math.min(1.2, rate));

        setTimeout(() => {
          video.playbackRate = 1.0;
        }, 800);
      }
    }

    function handleSync(payload) {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      if (payload.mediaSequence != null) {
        const buffered = video.buffered;
        if (buffered.length) {
          const liveEdge = buffered.end(buffered.length - 1);
          const target = liveEdge - 0.5;
          const delta = target - video.currentTime;
          correctPlayback(video, delta);
        }
      } else {
        if (video.paused) video.play().catch(() => {});
      }
    }

    socket.on("sync", handleSync);
    return () => socket.off("sync", handleSync);
  }, [socket]);

  return (
    <div className="player-card">
      <video
        className="player-video"
        ref={videoRef}
        controls
        muted
        playsInline
      />
    </div>
  );
}
