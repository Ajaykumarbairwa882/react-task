import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserRepos } from "../Api/Api";
import useTheme from "../Hooks/useTheme";
import Loader from "./Loader";
import ErrorState from "./Error";
import Empty from "./Empty";

const UserRepos = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortType, setSortType] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const perPage = 5;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserRepos(username);
        setRepos(data);
        setPage(1);
      } catch {
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, [username]);

  const languages = useMemo(
    () => [...new Set(repos.map((repo) => repo.language).filter(Boolean))],
    [repos]
  );

  const filteredRepos = useMemo(() => {
    let updated = [...repos];

    if (language) {
      updated = updated.filter((repo) => repo.language === language);
    }

    if (sortType === "stars") {
      updated.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortType === "forks") {
      updated.sort((a, b) => b.forks_count - a.forks_count);
    }

    return updated;
  }, [repos, sortType, language]);

  useEffect(() => {
    setPage(1);
  }, [sortType, language]);

  const paginated = filteredRepos.slice((page - 1) * perPage, page * perPage);

  const toggleBookmark = (repo) => {
    let savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    const exists = savedBookmarks.find((b) => b.id === repo.id);

    if (exists) {
      savedBookmarks = savedBookmarks.filter((b) => b.id !== repo.id);
    } else {
      savedBookmarks.push(repo);
    }

    localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
    setBookmarks(savedBookmarks);
  };

  const shell = isDark
    ? "min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8"
    : "min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8";

  const panel = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-50"
    : "border-slate-200 bg-white/80 text-slate-900";

  return (
    <main className={shell}>
      <section className="mx-auto w-full max-w-5xl">
        <div
          className={`rounded-[2rem] border p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 ${panel}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                GitHub Repositories
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {username}
              </h2>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Repositories for this user
              </p>
              <p className={`mt-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Bookmarked repos: {bookmarks.length}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => navigate("/")}
                className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition hover:opacity-90 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900"
                }`}
              >
                Back to search
              </button>

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
          </div>
        </div>

        <div
          className={`mt-6 rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              className={`h-11 appearance-none rounded-2xl border px-4 text-sm outline-none ${
                isDark
                  ? "border-white/10 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <option value="">Sort By</option>
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
            </select>

            <select
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
              className={`h-11 appearance-none rounded-2xl border px-4 text-sm outline-none ${
                isDark
                  ? "border-white/10 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            {loading ? <Loader label="Loading repositories..." /> : null}
            {error ? <ErrorState message={error} /> : null}

            {!loading && !error && repos.length === 0 ? (
              <Empty
                title="No repositories found"
                description="This user doesn't have public repositories yet."
              />
            ) : null}

            {!loading && !error && repos.length > 0 && filteredRepos.length === 0 ? (
              <Empty
                title="No matches for current filters"
                description="Try changing the language or sort options."
              />
            ) : null}

            <div className="mt-4 space-y-4">
              {paginated.map((repo) => (
                <div
                  key={repo.id}
                  className={`rounded-[1.25rem] border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/10"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {repo.name}
                      </h3>
                      <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {repo.description || "No description"}
                      </p>
                      <div className={`mt-4 flex flex-wrap gap-3 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        <span>Stars: {repo.stargazers_count}</span>
                        <span>Forks: {repo.forks_count}</span>
                        {repo.language ? <span>{repo.language}</span> : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(repo)}
                      className={`inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${
                        bookmarks.some((item) => item.id === repo.id)
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15"
                          : "border-indigo-400/30 text-indigo-300 hover:bg-indigo-400/10"
                      }`}
                    >
                      {bookmarks.some((item) => item.id === repo.id)
                        ? "Bookmarked"
                        : "Bookmark"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!loading && !error && filteredRepos.length > 0 ? (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page * perPage >= filteredRepos.length}
                  onClick={() => setPage(page + 1)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserRepos;
