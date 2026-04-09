import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../Api/Api";
import useDebounce from "../Hooks/useDebounce";
import useTheme from "../Hooks/useTheme";
import Loader from "./Loader";
import ErrorState from "./Error";
import Empty from "./Empty";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const debouncedQuery = useDebounce(query, 600);
  const lastFetchedQuery = useRef("");

  const runSearch = async (term) => {
    const cleanTerm = term.trim();

    if (!cleanTerm) {
      setUsers([]);
      setError("");
      setSearched(false);
      lastFetchedQuery.current = "";
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);
    lastFetchedQuery.current = cleanTerm;

    try {
      const data = await searchUsers(cleanTerm);
      setUsers(data);
    } catch (searchError) {
      setUsers([]);
      setError(searchError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await runSearch(query);
  };

  useEffect(() => {
    const term = debouncedQuery.trim();

    if (!term) {
      setUsers([]);
      setError("");
      setSearched(false);
      lastFetchedQuery.current = "";
      return;
    }

    if (term.length < 2) return;
    if (term === lastFetchedQuery.current) return;

    runSearch(term);
  }, [debouncedQuery]);

  const shell = isDark
    ? "min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8"
    : "min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8";

  const panel = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-50"
    : "border-slate-200 bg-white/80 text-slate-900";

  return (
    <main className={shell}>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header
          className={`rounded-[2rem] border p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 ${panel}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                GitHub User Search
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Find GitHub users and open their repositories.
              </h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Search users by name, view avatars, and jump into each user
                profile screen.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition hover:opacity-90 ${
                isDark
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-900"
              }`}
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={handleSearch}
            className={`rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
          >
            <label htmlFor="searchQuery" className="mb-3 block text-sm font-semibold">
              Search GitHub users
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="searchQuery"
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`h-12 flex-1 rounded-2xl border px-4 outline-none placeholder:text-slate-500 focus:ring-2 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white focus:border-indigo-400 focus:ring-indigo-400/30"
                    : "border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-300 px-6 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
{/* 
            <p className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              API: https://api.github.com/search/users?q={'{query}'}
            </p> */}
          </form>

          <div
            className={`rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
          >
            {loading ? <Loader label="Loading users..." /> : null}
            {error ? <ErrorState message={error} /> : null}

            {!loading && !error && searched && users.length === 0 ? (
              <Empty
                title="No users found"
                description="Try a different username or make the search more specific."
              />
            ) : null}

            {!loading && !error && !searched ? (
              <Empty
                title="Start searching"
                description="Enter at least two characters to see matching GitHub users."
              />
            ) : null}

            <div className="mt-4 grid gap-3">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => navigate(`/user/${user.login}`)}
                  className={`flex cursor-pointer items-center gap-4 rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/10"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <img
                    src={user.avatar_url}
                    alt={`${user.login} avatar`}
                    className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className={`truncate text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {user.login}
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      View repositories
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default UserSearch;
