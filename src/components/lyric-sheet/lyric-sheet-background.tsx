import { usePlayerStore } from "@/lib/store/playerStore";
import { useSettingStore } from "@/lib/store/settingStore";
import { MeshGradient } from "@paper-design/shaders-react";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export function LyricSheetBackground() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const coverUrl = currentSong?.al?.picUrl;
  const meshGradientProps = useSettingStore((s) => s.appearance.meshGradient);

  const [gradientColors, setGradientColors] = useState<string[]>([
    "#1a1a2e",
    "#16213e",
    "#0f3460",
    "#1a1a2e",
  ]);

  useEffect(() => {
    if (!coverUrl) return;

    const v = new Vibrant(coverUrl);
    v.getPalette()
      .then((palette) => {
        const muted = palette.Muted?.hex;
        const lightMuted = palette.LightMuted?.hex;
        const darkMuted = palette.DarkMuted?.hex;
        const lightVibrant = palette.LightVibrant?.hex;
        const darkVibrant = palette.DarkVibrant?.hex;
        const vibrant = palette.Vibrant?.hex;

        setGradientColors([
          muted || "",
          lightMuted || "",
          darkMuted || "",
          lightVibrant || "",
          darkVibrant || "",
          vibrant || "",
        ]);
      })
      .catch((e: unknown) => console.log(e));
  }, [coverUrl]);

  return (
    <div className="absolute inset-0">
      <MeshGradient
        colors={gradientColors}
        distortion={meshGradientProps.distortion}
        swirl={meshGradientProps.swirl}
        grainMixer={meshGradientProps.grainMixer}
        grainOverlay={meshGradientProps.grainOverlay}
        speed={isPlaying ? meshGradientProps.speed : 0}
        className="w-full h-full"
      />
    </div>
  );
}
