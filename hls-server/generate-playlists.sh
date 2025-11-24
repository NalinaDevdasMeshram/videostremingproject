#!/bin/bash
set -e


ROOT_DIR=/var/www/hls
MAIN_DIR=$ROOT_DIR/main
OUT_DIR=$ROOT_DIR


mkdir -p "$MAIN_DIR" "$OUT_DIR"


# Wait until ffmpeg creates a playlist
while [ ! -f "$MAIN_DIR/playlist.m3u8" ]; do
echo "Waiting for main playlist..."
sleep 1
done


# Loop and regenerate
while true; do
if [ -f "$MAIN_DIR/playlist.m3u8" ]; then
# Read the current playlist and rewrite segment URIs to point to main/
BODY=$(tail -n +4 $MAIN_DIR/playlist.m3u8 | sed "s#segment#main/segment#g")


for i in $(seq 1 6); do
cat > "$OUT_DIR/stream${i}.m3u8" <<EOF
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:2
$BODY
EOF
done
fi
sleep 1
done