import { Loading } from "@/components/loading";
import { SongList } from "@/components/song/song-list";
import { getPlaylistAllTrack } from "@/lib/services/playlist";
import { Song } from "@/lib/types";
import { CollectionsEmpty24Regular } from "@fluentui/react-icons";
import { useEffect, useMemo, useState } from "react";

export function PlaylistSongs({
  playlistId,
  query,
}: {
  playlistId: string | number;
  query: string;
}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPlaylistSongs() {
      setIsLoading(true);
      try {
        const res = await getPlaylistAllTrack(playlistId.toString());
        setSongs(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylistSongs();
  }, [playlistId]);

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
      {isLoading && <Loading />}
      {songs && <SongList songList={filteredSongs} showAlbum={true} />}
      {!isLoading && !songs.length && (
        <div className="h-64 text-black/60 flex items-center justify-center gap-4">
          <CollectionsEmpty24Regular /> 暂无歌曲
        </div>
      )}
    </div>
  );
}
