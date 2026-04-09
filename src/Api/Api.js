import axios from "axios";

export const searchUsers = async (query) => {
  const res = await axios.get(
    `https://api.github.com/search/users?q=${encodeURIComponent(query)}`
  );
  return res.data.items;
};

export const getUserRepos = async (username) => {
  const res = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );
  return res.data;
};
