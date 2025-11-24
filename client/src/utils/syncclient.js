import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export default function useSync(serverUrl) {
  const socketRef = useRef(null);
  const [syncData, setSyncData] = useState({
    serverTime: 0,
    segment: null,
    emittedAt: 0,
  });

  // --- CONNECT SOCKET ONLY ONCE ---
  if (!socketRef.current) {
    socketRef.current = io(serverUrl, { autoConnect: true });
  }

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("sync connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("sync disconnected");
    });

    // Receive periodic sync packets:
    //  { serverTime: <ms>, segment: <number>, emittedAt: <ms> }
    socket.on("sync", (payload) => {
      setSyncData({
        serverTime: payload.serverTime,
        segment: payload.segment,
        emittedAt: payload.emittedAt,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sync");
    };
  }, []);

  return { syncData };
  // socket: socketRef.current,
}
