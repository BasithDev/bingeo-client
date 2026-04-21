export interface IMovie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  releaseYear: number;
  rating: number;
  genres: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISeries {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  seasons: ISeason[];
  releaseYear: number;
  rating: number;
  genres: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISeason {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: IEpisode[];
}

export interface IEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription: ISubscriptionInfo;
  createdAt: string;
}

export interface ISubscriptionInfo {
  plan: "free" | "premium";
  status: "active" | "cancelled" | "expired";
  expiresAt: string | null;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IPlaybackToken {
  token: string;
  expiresAt: string;
  streamUrl: string;
}

export interface IWatchProgress {
  contentId: string;
  contentType: "movie" | "episode";
  position: number;
  duration: number;
  updatedAt: string;
}
