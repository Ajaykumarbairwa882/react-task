import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserRepos } from "../Api/Api";
import useTheme from "../Hooks/useTheme";
import Loader from "./Loader";
import ErrorState from "./Error";
import Empty from "./Empty";

const UserRepos = () => {

  // URL se username fetch (dynamic routing)
  const { username } = useParams();

  // navigation ke liye
  const navigate = useNavigate();

  // theme hook (dark/light)
  const { isDark, toggleTheme } = useTheme();

  // repositories data
  const [repos, setRepos] = useState([]);

  // loading state
  const [loading, setLoading] = useState(false);

  // error message
  const [error, setError] = useState("");

  // sorting type (stars / forks)
  const [sortType, setSortType] = useState("");

  // language filter
  const [language, setLanguage] = useState("");

  // pagination page number
  const [page, setPage] = useState(1);

  // bookmarked repos
  const [bookmarks, setBookmarks] = useState([]);

  // per page items
  const perPage = 5;

  //  FETCH REPOS 
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError("");

        // API call
        const data = await getUserRepos(username);
        setRepos(data);
        // console.log(data)

        // new user aaye to page reset
        setPage(1);
      } catch {
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  //  LOAD BOOKMARKS 
  useEffect(() => {
    // localStorage se bookmarks load
    const savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, [username]);

  //  UNIQUE LANGUAGES 
  const languages = useMemo(
    () =>
      // repos se unique languages nikal rahe hain
      [...new Set(repos.map((repo) => repo.language).filter(Boolean))],
    [repos], // jb repo change hogi tb run hoga
  );

  //  FILTER + SORT 
  const filteredRepos = useMemo(() => {
    let updated = [...repos];

    // language filter
    if (language) {
      updated = updated.filter((repo) => repo.language === language);
    }

    // sorting
    if (sortType === "stars") {
      updated.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );
    } else if (sortType === "forks") {
      updated.sort(
        (a, b) => b.forks_count - a.forks_count
      );
    }

    return updated;
  }, [repos, sortType, language]);

  //  RESET PAGE ON FILTER CHANGE 
  useEffect(() => {
    setPage(1);
  }, [sortType, language]);

  //  PAGINATION 
  const paginated = filteredRepos.slice(
    (page - 1) * perPage,  //if page=1 -> item 0-5
                            // if page 2->itme 5-10
    page * perPage
  );

  //  BOOKMARK TOGGLE 
  const toggleBookmark = (repo) => {

    // localStorage se bookmarks lo
    let savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarks")) || [];

    // check already exist karta hai ya nahi
    const exists = savedBookmarks.find((b) => b.id === repo.id);

    if (exists) {
      // remove bookmark
      savedBookmarks = savedBookmarks.filter(
        (b) => b.id !== repo.id
      );
    } else {
      // add bookmark
      savedBookmarks.push(repo);
    }

    // update localStorage
    localStorage.setItem(
      "bookmarks",
      JSON.stringify(savedBookmarks)
    );

    // state update
    setBookmarks(savedBookmarks);
  };

  //  STYLING 
  const shell = isDark
    ? "min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8"
    : "min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8";

  const panel = isDark
    ? "border-white/10 bg-slate-900/70 text-slate-50"
    : "border-slate-200 bg-white/80 text-slate-900";

  return (
    <main className={shell}>
      <section className="mx-auto w-full max-w-5xl">

        {/*  HEADER  */}
        <div
          className={`rounded-[2rem] border p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 ${panel}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            {/* user info */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                GitHub Repositories
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {username}
              </h2>

              <p
                className={`mt-2 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Repositories for this user
              </p>

              {/* bookmark count */}
              <p
                className={`mt-2 text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Bookmarked repos: {bookmarks.length}
              </p>
            </div>

            {/* buttons */}
            <div className="flex flex-col gap-3 sm:items-end">

              {/* back button */}
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

              {/* theme toggle */}
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

        {/*  FILTER SECTION  */}
        <div
          className={`mt-6 rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
        >

          {/* sorting + filtering */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">

            {/* sort dropdown */}
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

            {/* language filter */}
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

              {/* dynamic languages */}
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/*  RESULT  */}
          <div className="mt-5">

            {/* loading */}
            {loading ? <Loader label="Loading repositories..." /> : null}

            {/* error */}
            {error ? <ErrorState message={error} /> : null}

            {/* no repos */}
            {!loading && !error && repos.length === 0 ? (
              <Empty
                title="No repositories found"
                description="This user doesn't have public repositories yet."
              />
            ) : null}

            {/* filter no match */}
            {!loading &&
            !error &&
            repos.length > 0 &&
            filteredRepos.length === 0 ? (
              <Empty
                title="No matches for current filters"
                description="Try changing the language or sort options."
              />
            ) : null}

            {/* repo list */}
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

                    {/* repo details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold">
                        {repo.name}
                      </h3>

                      <p className="mt-2 text-sm">
                        {repo.description || "No description"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <span>Stars: {repo.stargazers_count}</span>
                        <span>Forks: {repo.forks_count}</span>
                        {repo.language ? <span>{repo.language}</span> : null}
                      </div>
                    </div>

                    {/* bookmark button */}
                    <button
                      type="button"
                      onClick={() => toggleBookmark(repo)}
                    >
                      {bookmarks.some((item) => item.id === repo.id)
                        ? "Bookmarked"
                        : "Bookmark"}
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/*  PAGINATION  */}
            {!loading && !error && filteredRepos.length > 0 ? (
              <div className="mt-5 flex items-center justify-center gap-3">

                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                <button
                  disabled={page * perPage >= filteredRepos.length}
                  onClick={() => setPage(page + 1)}
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