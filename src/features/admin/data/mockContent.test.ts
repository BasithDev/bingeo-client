import { describe, it, expect } from "vitest";
import { mockDrafts, GENRES } from "./mockContent";

describe("GENRES", () => {
  it("should be a non-empty array", () => {
    expect(GENRES.length).toBeGreaterThan(0);
  });

  it("should contain common genres", () => {
    expect(GENRES).toContain("Action");
    expect(GENRES).toContain("Comedy");
    expect(GENRES).toContain("Drama");
    expect(GENRES).toContain("Horror");
    expect(GENRES).toContain("Sci-Fi");
  });

  it("should have unique values", () => {
    const unique = new Set(GENRES);
    expect(unique.size).toBe(GENRES.length);
  });

  it("should be sorted alphabetically", () => {
    const sorted = [...GENRES].sort();
    expect([...GENRES]).toEqual(sorted);
  });
});

describe("mockDrafts", () => {
  it("should be a non-empty array", () => {
    expect(mockDrafts.length).toBeGreaterThan(0);
  });

  it("each draft should have required fields", () => {
    for (const draft of mockDrafts) {
      expect(draft.id).toBeDefined();
      expect(draft.title).toBeDefined();
      expect(draft.type).toBeDefined();
      expect(draft.genres).toBeInstanceOf(Array);
      expect(draft.cast).toBeInstanceOf(Array);
      expect(draft.seasons).toBeInstanceOf(Array);
      expect(draft.status).toBe("draft");
      expect(draft.createdAt).toBeDefined();
      expect(draft.updatedAt).toBeDefined();
    }
  });

  it("should have unique IDs", () => {
    const ids = mockDrafts.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("should have valid content types", () => {
    const validTypes = ["movie", "series", "special"];
    for (const draft of mockDrafts) {
      expect(validTypes).toContain(draft.type);
    }
  });

  it("should contain at least one of each type", () => {
    const types = new Set(mockDrafts.map((d) => d.type));
    expect(types.has("movie")).toBe(true);
    expect(types.has("series")).toBe(true);
    expect(types.has("special")).toBe(true);
  });

  it("series drafts should have seasons with episodes", () => {
    const series = mockDrafts.filter((d) => d.type === "series");
    expect(series.length).toBeGreaterThan(0);

    for (const s of series) {
      expect(s.seasons.length).toBeGreaterThan(0);
      for (const season of s.seasons) {
        expect(season.number).toBeGreaterThan(0);
        expect(season.title).toBeDefined();
        expect(season.episodes.length).toBeGreaterThan(0);
        for (const ep of season.episodes) {
          expect(ep.number).toBeGreaterThan(0);
          expect(ep.title).toBeDefined();
        }
      }
    }
  });

  it("non-series drafts should have empty seasons", () => {
    const nonSeries = mockDrafts.filter((d) => d.type !== "series");
    for (const d of nonSeries) {
      expect(d.seasons).toEqual([]);
    }
  });

  it("drafts with poster URLs should have valid URLs", () => {
    const withPoster = mockDrafts.filter((d) => d.posterUrl);
    expect(withPoster.length).toBeGreaterThan(0);
    for (const d of withPoster) {
      expect(d.posterUrl!.startsWith("http")).toBe(true);
    }
  });

  it("all genres referenced in drafts should exist in GENRES list", () => {
    const genreSet = new Set(GENRES as readonly string[]);
    for (const draft of mockDrafts) {
      for (const genre of draft.genres) {
        expect(genreSet.has(genre)).toBe(true);
      }
    }
  });
});
