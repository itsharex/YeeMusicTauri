import { SongList } from "@/components/song/song-list";
import { Song } from "@/lib/types";
import { CollectionsEmpty24Regular } from "@fluentui/react-icons";
import { useMemo } from "react";

export function PlaylistSongs({
  songs,
  query,
}: {
  songs: Song[];
  query: string;
}) {
  const filteredSongs = useMemo(() => {
    if (!query) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.ar?.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            s.al?.name.toLowerCase().includes(q),
        ),
    );
  }, [songs, query]);

  return (
    <div className="w-full h-full">
      {songs && <SongList songList={filteredSongs} showAlbum={true} />}
      {!songs.length && (
        <div className="h-64 text-black/60 flex items-center justify-center gap-4">
          <CollectionsEmpty24Regular /> 暂无歌曲
        </div>
      )}
    </div>
  );
}
