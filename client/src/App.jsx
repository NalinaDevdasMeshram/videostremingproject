import Player from "./component/player.jsx";
import useSync from "./utils/syncclient.js";
import { IoEyeOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { GoDatabase } from "react-icons/go";
import { GoDotFill } from "react-icons/go";
import { IoIosRefresh } from "react-icons/io";

const HLS_BASE =
  process.env.REACT_APP_HLS_BASE ||
  "http://localhost:8080//13.60.76.79:8554/live2";

const SYNC_SERVER =
  process.env.REACT_APP_SYNC_SERVER || "http://localhost:3001";

const streams = [
  `${HLS_BASE}/stream1.m3u8`,
  `${HLS_BASE}/stream2.m3u8`,
  `${HLS_BASE}/stream3.m3u8`,
  `${HLS_BASE}/stream4.m3u8`,
  `${HLS_BASE}/stream5.m3u8`,
  `${HLS_BASE}/stream6.m3u8`,
];

export default function App() {
  const { socket, syncData } = useSync(SYNC_SERVER);

  return (
    <div className="dg-root">
      {/* TOP HEADER */}
      <div className="dg-header">
        <div className="dg-title">Multi-View Monitoring Dashboard</div>
        <div className="dg-badges">
          <span className="dg-badge dg-badge--green">Connected</span>
          <span className="dg-badge dg-badge--green">MQTT Connected</span>
        </div>
      </div>

      {/* SYSTEM OVERVIEW */}
      <div className="dg-grid dg-overview">
        <div className="dg-card">
          <div className="dg-card-content">
            <div className="dg-muted">Active Cameras</div>
            <div className="dg-large dg-green">
              {" "}
              <IoEyeOutline />
              4/6
            </div>
          </div>
        </div>

        <div className="dg-card">
          <div className="dg-card-content">
            <div className="dg-muted">Active Alerts</div>
            <div className="dg-large dg-red">
              <GoAlert />2
            </div>
          </div>
        </div>
        <div className="dg-card">
          <div className="dg-card-content">
            <div className="dg-muted">Total Cameras</div>
            <div className="dg-large dg-blue">
              <GoDatabase />6
            </div>
          </div>
        </div>
      </div>

      {/* ALERT BANNER */}
      <div className="dg-alert">⚠️ 2 cameras reporting violations</div>

      {/* CAMERA WALL */}
      <div className="dg-section">
        <div className="dg-grid dg-camera-grid">
          <div className="dg-card dg-camera-card">
            <div className="dg-card-content">
              <div className="dg-badge-row">
                <h2 className="dg-section-title">
                  CCTV Monitoring Wall{" "}
                  <div className="dg-inner-section">
                    <span>
                      Managing 6 cameras
                      <span>
                        {" "}
                        <GoDotFill />6 concurrent live slot
                      </span>
                    </span>
                  </div>
                </h2>
                <div className="dg-right-section">
                  <span className="dg-badge dg-badge--green">AI Mode</span>
                  <span className="dg-badge dg-badge--green">Online</span>
                  <span className="dg-badge dg-badge--teal">
                    <IoIosRefresh />
                    Retry All Live Feeds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* <-- FIXED: CLOSED PROPERLY */}
      </div>

      {/* PLAYER GRID (3 CARDS PER ROW) */}
      <div className="grid">
        {streams.map((src, i) => (
          <Player
            key={i}
            src={src}
            socket={socket}
            sync={syncData}
            index={i}
            WEBRTC
            LIVE
          />
        ))}
      </div>

      <footer>
        © 2025 Multi-View Monitoring Dashboard System. All rights reserved. |
        Version 2.1.4
      </footer>
    </div>
  );
}
