import axios from "axios";

//  SEARCH USERS 
export const searchUsers = async (query) => {

  // GitHub search API call
  const res = await axios.get(
    // encodeURIComponent special characters handle karta hai (space, etc.)
    `https://api.github.com/search/users?q=${encodeURIComponent(query)}`
  );
  return res.data.items;
};


//  GET USER REPOSITORIES 
export const getUserRepos = async (username) => {

  // specific user ke repositories fetch kar rahe hain
  const res = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );

  return res.data;
};