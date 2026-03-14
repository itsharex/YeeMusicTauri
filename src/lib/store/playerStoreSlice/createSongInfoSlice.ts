import { StateCreator } from "zustand";
import { SharedPlayerState, SongInfoSlice } from "@/lib/types/player";
import { SONG_QUALITY } from "@/lib/constants/song";
import { getSongUrl } from "@/lib/services/song";
import { corePlayer } from "@/lib/player/corePlayer";

export const createSongInfoSlice: StateCreator<
  SharedPlayerState,
  [],
  [],
  SongInfoSlice
> = (set, get) => ({
  currentSong: null,
  currentSongMusicDetail: [],
  currentSongLyrics: null,
  preferMusicLevel: "sq",
  currentMusicLevel: "sq",

  setCurrentMusicLevel: async (level: keyof typeof SONG_QUALITY) => {
    const { currentSong, currentMusicLevel, currentTime } = get();

    if (!currentSong || level === currentMusicLevel) {
      set({ currentMusicLevel: level });
      return;
    }

    set({ currentMusicLevel: level, isLoadingMusic: true });

    try {
      const res = await getSongUrl(
        [currentSong.id.toString()],
        SONG_QUALITY[level].level,
      );

      if (res?.[0]?.url) {
        corePlayer.play(
          res?.[0]?.url,
          () => get().next(),
          (duration) => {
            set({ isPlaying: true, duration, isLoadingMusic: false });
            get().seek((currentTime / duration) * 100);
          },
          (currentTime) => {
            const { duration } = get();
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            set({ currentTime, progress });
          },
        );
      }
    } catch (err) {
      console.log("切换音质失败", err);
      set({ isLoadingMusic: false });
    }
  },

  setPreferMusicLevel: (level: keyof typeof SONG_QUALITY) => {
    set({ preferMusicLevel: level });
  },
});
