import { useSearchParams } from "react-router-dom";
import { PlaylistPage } from "@/components/playlist/detail/playlist-page";
import { DetailPageSkeleton } from "@/components/detail-page-skeleton";
import { getPlaylistDetail } from "@/lib/services/playlist";
import { Playlist } from "@/lib/types";
import { useEffect, useState, Suspense } from "react";
import { useUserStore } from "@/lib/store/userStore";

function PlaylistContent() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    async function fetchPlaylist() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await getPlaylistDetail(id);
        setPlaylist(res.playlist);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylist();
  }, [id]);

  if (!id) return <div className="p-8">未找到歌单 ID</div>;

  return (
    <div className="w-full h-full px-8 py-8 flex flex-col gap-8">
      <DetailPageSkeleton loading={isLoading} data={playlist}>
        {(data) => (
          <PlaylistPage
            playlist={data}
            isMyPlaylist={data.creator.userId === user?.userId}
            onRefresh={() => {}}
          />
        )}
      </DetailPageSkeleton>
    </div>
  );
}

export default function PlaylistDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaylistContent />
    </Suspense>
  );
}
