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

## Deploy On Render

This project is ready for Render as a static site.

### Files Already Added

- `render.yaml` for Render Blueprint deployment

### Render Settings

- **Type:** Static Site
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

### Steps

1. Push this project to GitHub.
2. Open the Render dashboard.
3. Click `New +` and choose `Blueprint`.
4. Connect your GitHub repository.
5. Render will read `render.yaml` automatically.
6. Deploy the app.

### Important Note

This app uses `BrowserRouter`, so route refreshes need rewrite support. The `render.yaml` file already handles this by redirecting all routes to `index.html`.

## Deploy On Vercel

This project is also ready for Vercel as a static React app.

### Files Added

- `vercel.json` for SPA routing support

### Vercel Settings

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Steps

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Keep the build command as `npm run build`.
4. Set the output directory to `dist`.
5. Deploy the project.

### Important Note

Because this app uses `BrowserRouter`, Vercel needs a rewrite rule so direct route refreshes like `/user/:username` keep working. That is handled in `vercel.json`.

## Project Structure

- `src/Api` - API helper functions
- `src/component` - UI components
- `src/Hooks` - Custom hooks
- `src/App.jsx` - App routes

## API Used

- GitHub user search: `https://api.github.com/search/users?q={query}`
- GitHub repositories: `https://api.github.com/users/{username}/repos`
