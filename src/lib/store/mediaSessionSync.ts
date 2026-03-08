import { usePlayerStore } from "./playerStore";

export function initMediaSession() {
  if (!("mediaSession" in navigator)) return;

  usePlayerStore.subscribe(
    (state) => state.currentSong,
    (currentSong) => {
      if (!currentSong) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        artist: currentSong.ar.map((a) => a.name).join("、"),
        album: currentSong.al.name,
        artwork: [
          {
            src: `${currentSong.al?.picUrl}?param=96y96`,
            sizes: "96x96",
            type: "image/jpeg",
          },
          {
            src: `${currentSong.al?.picUrl}?param=256y256`,
            sizes: "256x256",
            type: "image/jpeg",
          },
          {
            src: `${currentSong.al?.picUrl}?param=512y512`,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });
    },
  );

  usePlayerStore.subscribe(
    (state) => state.isPlaying,
    (isPlaying) => {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    },
  );

  usePlayerStore.subscribe(
    (state) => ({
      time: state.currentTime,
      duration: state.duration,
    }),
    ({ time, duration }) => {
      if (duration > 0 && navigator.mediaSession.setPositionState) {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1,
          position: time,
        });
      }
    },
  );

  // 播放
  navigator.mediaSession.setActionHandler("play", () => {
    const { isPlaying, togglePlay } = usePlayerStore.getState();
    if (!isPlaying) togglePlay();
  });

  // 暂停
  navigator.mediaSession.setActionHandler("pause", () => {
    const { isPlaying, togglePlay } = usePlayerStore.getState();
    if (isPlaying) togglePlay();
  });

  // 上一首
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    usePlayerStore.getState().prev();
  });

  // 下一首
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    usePlayerStore.getState().next();
  });

  // 拖动进度条
  navigator.mediaSession.setActionHandler("seekto", (details) => {
    const { duration, seek } = usePlayerStore.getState();
    if (details.seekTime !== undefined && duration > 0) {
      seek((details.seekTime / duration) * 100);
    }
  });
}
