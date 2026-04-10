import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../Api/Api";
import useDebounce from "../Hooks/useDebounce";
import useTheme from "../Hooks/useTheme";
import Loader from "./Loader";
import ErrorState from "./Error";
import Empty from "./Empty";

const UserSearch = () => {

  // user input store karega
  const [query, setQuery] = useState("");

  // API se aaye users store karega
  const [users, setUsers] = useState([]);

  // loading state (API call ke time true)
  const [loading, setLoading] = useState(false);

  // error message store karne ke liye
  const [error, setError] = useState("");

  // check karega ki search kiya gaya hai ya nahi
  const [searched, setSearched] = useState(false);

  // navigation ke liye (user detail page pe jane ke liye)
  const navigate = useNavigate();

  // theme toggle (dark/light)
  const { isDark, toggleTheme } = useTheme();

  // debounce hook (API call delay karega jab user type kare)
  const debouncedQuery = useDebounce(query, 600);

  //  SEARCH FUNCTION 
  const runSearch = async (term) => {

    // extra spaces hata rahe hain
    const cleanTerm = term.trim();

    // agar input empty hai
    if (!cleanTerm) {
      setUsers([]);       // users clear
      setError("");       // error clear
      setSearched(false); // search state reset
      return;
    }

    setLoading(true);     // loader start
    setError("");         // old error hatao
    setSearched(true);    // mark as searched

    try {
      // API call
      const data = await searchUsers(cleanTerm);
      setUsers(data);     // users set karo
    } catch (searchError) {
      // error handle
      setUsers([]);
      setError(searchError.message || "Something went wrong.");
    } finally {
      setLoading(false);  // loader band
    }
  };

  //  FORM SUBMIT 
  const handleSearch = async (event) => {
    event.preventDefault(); // page reload rokna
    await runSearch(query); // manual search
  };

  //  AUTO SEARCH (DEBOUNCE) 
  useEffect(() => {

    // debounced value ko trim kiya
    const term = debouncedQuery.trim();

    // agar user sirf spaces likhe
    if (!term) {
      setUsers([]);
      setError("");
      setSearched(false);
      return;
    }

    // minimum 2 characters hone chahiye
    if (term.length < 2) return;

    // API call
    runSearch(term);

  }, [debouncedQuery]);



  // main background wrapper
  const shell = isDark
    ? "min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8"
    : "min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8";

  // card/panel styling
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

            {/* left content */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                GitHub User Search
              </p>

              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Find GitHub users and open their repositories.
              </h1>

              <p className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>
                Search users by name, view avatars, and jump into each user
                profile screen.
              </p>
            </div>

            {/* theme toggle button */}
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

        {/* = MAIN SECTION  */}
        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">

          {/* SEARCH FORM */}
          <form
            onSubmit={handleSearch}
            className={`rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
          >
            <label htmlFor="searchQuery" className="mb-3 block text-sm font-semibold">
              Search GitHub users
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* input field */}
              <input
                id="searchQuery"
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} // input update
                className={`h-12 flex-1 rounded-2xl border px-4 outline-none placeholder:text-slate-500 focus:ring-2 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white focus:border-indigo-400 focus:ring-indigo-400/30"
                    : "border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
              />

              {/* search button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-300 px-6 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/*  RESULT SECTION  */}
          <div
            className={`rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 ${panel}`}
          >

            {/* loader */}
            {loading ? <Loader label="Loading users..." /> : null}

            {/* error */}
            {error ? <ErrorState message={error} /> : null}

            {/* no users found */}
            {!loading && !error && searched && users.length === 0 ? (
              <Empty
                title="No users found"
                description="Try a different username or make the search more specific."
              />
            ) : null}

            {/* initial state */}
            {!loading && !error && !searched ? (
              <Empty
                title="Start searching"
                description="Enter at least two characters to see matching GitHub users."
              />
            ) : null}

            {/* user list */}
            <div className="mt-4 grid gap-3">
              {users.map((user) => (

                // each user card (clickable)
                <button
                  key={user.id}
                  type="button"
                  onClick={() => navigate(`/user/${user.login}`)} // navigate to detail
                  className={`flex cursor-pointer items-center gap-4 rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/10"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >

                  {/* user avatar */}
                  <img
                    src={user.avatar_url}
                    alt={`${user.login} avatar`}
                    className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
                  />

                  {/* user info */}
                  <div className="min-w-0">
                    <h2 className={`truncate text-base font-semibold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {user.login}
                    </h2>

                    <p className={`mt-1 text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
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