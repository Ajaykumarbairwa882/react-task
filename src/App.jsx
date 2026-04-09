import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRepos from "./component/UserRepos";
import UserSearch from "./component/Usersearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSearch />} />
        <Route path="/user/:username" element={<UserRepos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
