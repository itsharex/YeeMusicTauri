// "use client";

// import { RecentListenResource } from "@/lib/types";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Play28Filled } from "@fluentui/react-icons";
// import { usePlayerStore } from "@/lib/store/playerStore";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Vibrant } from "node-vibrant/browser";
// import ChromaGrid from "@/components/ChromaGrid";

// export function RecentListenCard({
//   resource,
// }: {
//   resource: RecentListenResource | null;
// }) {
//   const { playList } = usePlayerStore();

//   function handlePlay(e: React.MouseEvent) {
//     e.stopPropagation();
//     if (resource?.resourceId)
//       playList(resource?.resourceId, resource.resourceType);
//   }

//   if (!resource) {
//     return (
//       <div className="w-32 flex flex-col gap-3">
//         <div className="w-full h-32 rounded-lg overflow-hidden">
//           <Skeleton className="w-full h-full" />
//         </div>
//         <div className="flex flex-col gap-3 w-full">
//           <Skeleton className="w-full h-4" />

//           <Skeleton className="w-16 h-4" />
//         </div>
//       </div>
//     );
//   }

//   const title = resource.title;
//   const cover = resource.coverUrlList?.[0];
//   const tag = resource.tag;

//   const typeLink =
//     resource.resourceType === "list" ? "playlist" : resource.resourceType;
//   const link = `/detail/${typeLink}?id=${resource.resourceId}`;

//   const [coverColor, setCoverColor] = useState("black");

//   useEffect(() => {
//     if (!cover) return;

//     const v = new Vibrant(cover);
//     v.getPalette().then((palette) => {
//       const muted = palette.Vibrant?.hex;
//       setCoverColor(muted || "black");
//     });
//   }, [cover]);

//   return (
//     <div
//       className="w-32 flex flex-col gap-4 bg-(--cover-color) rounded-lg overflow-hidden"
//       style={{ "--cover-color": coverColor } as React.CSSProperties}
//     >
//       <div className="w-full h-32 overflow-hidden group cursor-pointer">
//         <div className="w-full h-full relative  group-hover:brightness-50 ">
//           <Link href={link}>
//             <Image
//               className="transition duration-300 ease-in-out w-full h-full object-cover"
//               fill
//               src={cover}
//               alt="Album cover"
//             />
//           </Link>
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)",
//             }}
//           />

//           <span className="absolute bottom-2.5 left-2.5 text-sm font-medium text-white drop-shadow-md">
//             {tag}
//           </span>
//         </div>
//         <div className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:text-gray-200">
//           <Play28Filled onClick={handlePlay} />
//         </div>
//       </div>
//       <div className="w-full flex flex-col overflow-hidden items-center justify-center"></div>
//     </div>
//   );
// }
