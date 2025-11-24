FROM ubuntu:22.04


ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
ffmpeg \
nginx \
curl \
inotify-tools \
&& rm -rf /var/lib/apt/lists/*


# Create web root
RUN mkdir -p /var/www/hls /app
COPY ffmpeg-run.sh /app/ffmpeg-run.sh
COPY generate_playlists.sh /app/generate_playlists.sh
COPY nginx.conf /etc/nginx/nginx.conf


RUN chmod +x /app/ffmpeg-run.sh /app/generate_playlists.sh


VOLUME ["/var/www/hls"]
WORKDIR /app


CMD ["/bin/bash", "-c", "/app/ffmpeg-run.sh & /app/generate_playlists.sh"]