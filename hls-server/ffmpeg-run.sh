#!/bin/bash
set -e


RTSP_URL="rtsp://13.60.76.79:8554/live"
OUT_DIR="/var/www/hls/main"
mkdir -p "$OUT_DIR"


# Clean old files
rm -f $OUT_DIR/*


# Run ffmpeg: copy video for low cpu, short segments for low latency
ffmpeg -hide_banner -loglevel info \
-rtsp_transport tcp -i "$RTSP_URL" \
-c:v copy -c:a aac -ar 44100 -ac 1 \
-f hls \
-hls_time 1 \
-hls_list_size 5 \
-hls_flags delete_segments+append_list+omit_endlist \
-hls_segment_filename "$OUT_DIR/segment%05d.ts" \
"$OUT_DIR/playlist.m3u8"


# Note: ffmpeg will run until killed. Using -c:v copy to avoid re-encoding.