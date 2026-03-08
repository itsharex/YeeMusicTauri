import {
  Heart24Filled,
  Heart24Regular,
  HeartOff24Regular,
} from "@fluentui/react-icons";

export const SONG_QUALITY = {
  l: {
    level: "standard",
    desc: "标准",
    weight: 0,
  },
  m: {
    level: "higher",
    desc: "较高",
    weight: 1,
  },
  h: {
    level: "exhigh",
    desc: "极高",
    weight: 2,
  },
  sq: {
    level: "lossless",
    desc: "无损",
    weight: 3,
  },
  hr: {
    level: "hires",
    desc: "Hi-Res",
    weight: 4,
  },
  je: {
    level: "jyeffect",
    desc: "高清环绕声",
    weight: 5,
  },
  sk: {
    level: "sky",
    desc: "沉浸环绕声",
    weight: 6,
  },
  db: {
    level: "dolby",
    desc: "杜比全景声",
    weight: 7,
  },
  jm: {
    level: "jymaster",
    desc: "超清母带",
    weight: 8,
  },
  unlock: {
    level: "unlock",
    desc: "UNLOCK",
    weight: -1,
  },
} as const;

export type QualityKey = keyof typeof SONG_QUALITY;

export const getQualityKeyByLevel = (
  levelStr: string | undefined,
): QualityKey => {
  const entry = Object.entries(SONG_QUALITY).find(
    ([_, val]) => val.level === levelStr,
  );
  return (entry ? entry[0] : "l") as QualityKey;
};

export const needsDowngrade = (preferKey: QualityKey, maxKey: QualityKey) => {
  return SONG_QUALITY[preferKey].weight > SONG_QUALITY[maxKey].weight;
};

export const LIKE_ICON = {
  like: Heart24Filled,
  unlike: Heart24Regular,
  dislike: HeartOff24Regular,
} as const;
