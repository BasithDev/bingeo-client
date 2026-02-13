import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { CastMember } from "../../types/content.types";

/* ── TMDb search result shape ─────────────────── */

interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

/* ── Fallback mock results when no API key ────── */

const MOCK_RESULTS: TmdbPerson[] = [
  { id: 1, name: "Shah Rukh Khan", profile_path: null, known_for_department: "Acting" },
  { id: 2, name: "Deepika Padukone", profile_path: null, known_for_department: "Acting" },
  { id: 3, name: "Aamir Khan", profile_path: null, known_for_department: "Acting" },
  { id: 4, name: "Priyanka Chopra", profile_path: null, known_for_department: "Acting" },
  { id: 5, name: "Ranveer Singh", profile_path: null, known_for_department: "Acting" },
  { id: 6, name: "Alia Bhatt", profile_path: null, known_for_department: "Acting" },
  { id: 7, name: "Rajinikanth", profile_path: null, known_for_department: "Acting" },
  { id: 8, name: "Vijay Sethupathi", profile_path: null, known_for_department: "Acting" },
  { id: 9, name: "Samantha Ruth Prabhu", profile_path: null, known_for_department: "Acting" },
  { id: 10, name: "Pankaj Tripathi", profile_path: null, known_for_department: "Acting" },
];

/* ── Props ────────────────────────────────────── */

interface CastSearchProps {
  cast: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export function CastSearch({ cast, onChange }: CastSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Debounced search */
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        if (apiKey) {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(q)}&page=1`,
          );
          const data = await res.json();
          setResults((data.results ?? []).slice(0, 8));
        } else {
          // Fallback to mock
          const filtered = MOCK_RESULTS.filter((p) =>
            p.name.toLowerCase().includes(q.toLowerCase()),
          );
          setResults(filtered);
        }
      } catch {
        // Fallback to mock on error
        const filtered = MOCK_RESULTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
        setResults(filtered);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 350);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    search(val);
  };

  const addPerson = (person: TmdbPerson) => {
    if (cast.some((c) => c.id === person.id)) return;
    onChange([
      ...cast,
      {
        id: person.id,
        name: person.name,
        character: "",
        profilePath: person.profile_path ? `${TMDB_IMG}${person.profile_path}` : "",
      },
    ]);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const removePerson = (id: number) => {
    onChange(cast.filter((c) => c.id !== id));
  };

  const updateCharacter = (id: number, character: string) => {
    onChange(cast.map((c) => (c.id === id ? { ...c, character } : c)));
  };

  return (
    <div className="space-y-3">
      <label htmlFor="cast-search" className="text-sm font-medium text-foreground">
        Cast
      </label>

      {/* Search input */}
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="cast-search"
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search actors, directors..."
            className={cn(
              "w-full rounded-xl border border-border bg-background px-10 py-2.5 text-sm text-foreground",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
            )}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>

        {/* Dropdown results */}
        {open && results.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl max-h-64 overflow-y-auto">
            {results.map((p) => {
              const alreadyAdded = cast.some((c) => c.id === p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => addPerson(p)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 text-left cursor-pointer",
                    "hover:bg-muted/50 transition-colors",
                    alreadyAdded && "opacity-40 cursor-not-allowed",
                  )}
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {p.profile_path ? (
                      <img
                        src={`${TMDB_IMG}${p.profile_path}`}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
                        {p.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.known_for_department}</p>
                  </div>
                  {alreadyAdded && (
                    <span className="ml-auto text-[10px] text-muted-foreground">Added</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {open && results.length === 0 && !loading && query.length >= 2 && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">No results found</p>
          </div>
        )}
      </div>

      {/* Added cast cards */}
      {cast.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cast.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {c.profilePath ? (
                  <img src={c.profilePath} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {c.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                <input
                  type="text"
                  value={c.character}
                  onChange={(e) => updateCharacter(c.id, e.target.value)}
                  placeholder="Character / Role"
                  className="w-full bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none mt-0.5"
                />
              </div>

              <button
                type="button"
                onClick={() => removePerson(c.id)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
