/* ══════════════════════════════════════════════════
   Content types for admin content upload flow.
   ══════════════════════════════════════════════════ */

export type ContentType = "movie" | "series" | "special";
export type ContentStatus = "draft" | "uploading" | "published";

export interface Episode {
  number: number;
  title: string;
  plot: string;
  duration: string; // "45m", "1h 02m", etc.
}

export interface Season {
  number: number;
  title: string; // "Season 1", editable
  episodes: Episode[];
}

export interface CastMember {
  id: number; // TMDb person ID
  name: string;
  character: string; // role in this content
  profilePath: string; // TMDb image path
}

export interface ContentMetadata {
  id: string;
  title: string;
  type: ContentType;
  genres: string[];
  plot: string;
  duration: string; // "2h 15m" — manual or auto from video
  cast: CastMember[];
  seasons: Season[]; // only used when type === "series"
  posterUrl?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}
