# React Task

A React app for searching GitHub users and viewing their repositories.

## Features

- Search GitHub users by username
- View avatar and username in results
- Open a user's repository page
- Sort repositories by stars or forks
- Filter repositories by language
- Pagination for repository lists
- Bookmark repositories in local storage
- Dark mode and light mode toggle

## Tech Stack

- React
- React Router
- Vite
- Tailwind CSS
- Axios

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

- `src/Api` - API helper functions
- `src/component` - UI components
- `src/Hooks` - Custom hooks
- `src/App.jsx` - App routes

## API Used

- GitHub user search: `https://api.github.com/search/users?q={query}`
- GitHub repositories: `https://api.github.com/users/{username}/repos`
