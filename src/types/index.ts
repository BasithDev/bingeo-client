/**
 * Shared Type Definitions
 */

// Content types
export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in seconds
  releaseYear: number;
  rating: number;
  genres: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  seasons: Season[];
  releaseYear: number;
  rating: number;
  genres: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription: SubscriptionInfo;
  createdAt: string;
}

export interface SubscriptionInfo {
  plan: "free" | "premium";
  status: "active" | "cancelled" | "expired";
  expiresAt: string | null;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Playback types
export interface PlaybackToken {
  token: string;
  expiresAt: string;
  streamUrl: string;
}

export interface WatchProgress {
  contentId: string;
  contentType: "movie" | "episode";
  position: number; // in seconds
  duration: number;
  updatedAt: string;
}
