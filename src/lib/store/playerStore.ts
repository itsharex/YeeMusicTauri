import { create } from "zustand";
import { SharedPlayerState } from "../types/player";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { createPlaylistSlice } from "./playerStoreSlice/createPlaylistSlice";
import { createPlayerControlSlice } from "./playerStoreSlice/createPlayerControlSlice";
import { createSongInfoSlice } from "./playerStoreSlice/createSongInfoSlice";

export const usePlayerStore = create<SharedPlayerState>()(
  persist(
    subscribeWithSelector((...a) => ({
      ...createPlaylistSlice(...a),
      ...createPlayerControlSlice(...a),
      ...createSongInfoSlice(...a),
    })),
    {
      name: "player-store",
      partialize: (state) => ({
        currentSong: state.currentSong,
        currentIndexInPlaylist: state.currentIndexInPlaylist,
        playlist: state.playlist,
        volume: state.volume,
        currentMusicLevel: state.currentMusicLevel,
        preferMusicLevel: state.preferMusicLevel,
        repeatMode: state.repeatMode,
        isShuffle: state.isShuffle,
      }),
    },
  ),
);
