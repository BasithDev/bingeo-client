export type ContentType = "movie" | "series" | "special";
export type ContentStatus = "draft" | "upcoming" | "uploaded" | "processing" | "ready";

export interface IEpisode {
  number: number;
  title: string;
  plot: string;
  duration: string;
}

export interface ISeason {
  number: number;
  title: string;
  episodes: IEpisode[];
}

export interface ICastMember {
  id: number; 
  name: string;
  character: string;
  profilePath: string; 
}

export interface IContentMetadata {
  id: string;
  title: string;
  type: ContentType;
  genres: string[];
  plot: string;
  duration: string;
  cast: ICastMember[];
  seasons: ISeason[]; 
  posterUrl?: string;
  thumbnailKey?: string;
  videoKey?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}
