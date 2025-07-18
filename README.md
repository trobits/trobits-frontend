# Trobits Frontend

## Overview

This project is a modern web application built with Next.js and React, utilizing TypeScript for type safety and Redux for state management. The application is structured for scalability and maintainability, with a clear separation of concerns between features, components, pages, and state logic. It includes authentication, a variety of feature pages, reusable UI components, and API integrations.

---

## Project Structure

```
├── .env.development         # Environment variables for development
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore rules
├── components.json          # Component registry/config (if used)
├── lib/                     # Shared libraries/utilities
├── next-env.d.ts            # Next.js TypeScript environment
├── next.config.mjs          # Next.js configuration
├── node_modules/            # Node.js dependencies
├── package-lock.json        # NPM lock file
├── package.json             # Project manifest
├── postcss.config.mjs       # PostCSS configuration
├── public/                  # Static assets (images, etc.)
├── README.md                # Project documentation
├── src/                     # Main source code
│   ├── app/                 # Application pages, layouts, and routing
│   ├── assets/              # Project-specific assets
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Additional shared libraries
│   ├── provider/            # Context providers
│   └── redux/               # Redux state management
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
```

---

## Key Directories and Files

### `src/app/`
- **Purpose:** Contains all application pages, layouts, and routing logic (Next.js app directory).
- **Notable files:**
  - `layout.tsx`: Root layout for the app.
  - `middleware.ts`: Middleware for request handling (e.g., auth, redirects).
  - `globals.css`: Global CSS imports.
  - `not-found.tsx`: Custom 404 page.
- **Subdirectories:**
  - `(withCommonLayout)/`: Main feature pages, each in its own directory (see below).
  - `api/`: API route handlers (if any).
  - `fonts/`: Custom fonts.
  - `shared/`: Shared utilities or components for the app.

#### `src/app/(withCommonLayout)/`
- **Purpose:** Houses the main feature pages and sections of the application, each as a subdirectory.
- **Examples:**
  - `aboutus/`, `articles/`, `auth/`, `cryptohub/`, `cryptogame/`, `leaderboard/`, `learn/`, etc.
  - Each feature directory typically contains a `page.tsx` (the main page component) and may have additional files or subdirectories for related components or logic.
  - `layout.tsx`: Layout for all pages in this section.
  - `error.tsx`, `not-found.tsx`: Error and 404 handling for this section.

##### Example: `auth/`
- `forgotPassword/`, `login/`, `signin/`: Each contains a `page.tsx` for the respective authentication page.

##### Example: `cryptohub/`
- Contains subdirectories for features like `cryptochat/`, `feed/`, `myspot/`, `notifications/`, `userProfile/`, `videoPost/`.
- Each subdirectory typically contains a `page.tsx` for the main feature page.
- `layout.tsx`: Layout for cryptohub section.
- `Redirect.tsx`: Handles redirects within cryptohub.

### `src/components/`
- **Purpose:** Contains all reusable UI components, organized by feature or type.
- **Examples:**
  - `AdBanner.tsx`, `AffiliateLinks.tsx`, `shiba.tsx`, `SideAd.tsx`: Standalone components.
  - Feature folders: `articles/`, `Auth/`, `Cards/`, `Cryptohub/`, `HomePages/`, `Learn/`, `LoadingAnimation/`, `NewsPart/`, `Post/`, `PricePageTable/`, `Profile/`, `Shared/`, `ui/`, `VideoModal/`.
  - Each folder contains components related to that feature or UI section.

### `src/redux/`
- **Purpose:** Redux state management setup and logic.
- **Files:**
  - `store.tsx`: Configures the Redux store.
  - `hooks.tsx`: Custom hooks for accessing Redux state and dispatch.
- **Subdirectories:**
  - `features/`: Contains feature-specific Redux logic.
    - `api/`: API service definitions (RTK Query or similar), e.g., `archiveApi.tsx`, `articleApi.tsx`, `authApi.tsx`, `baseApi.tsx`, `currencyApi.tsx`, `postApi.tsx`, `socketClient.ts`, `topicApi.tsx`.
    - `slices/`: Redux slices for managing state of different features.

### `src/hooks/`
- **Purpose:** Custom React hooks for encapsulating reusable logic.

### `src/lib/`
- **Purpose:** Shared libraries and utility functions used across the app.

### `src/provider/`
- **Purpose:** Context providers for global state or configuration.

### `src/assets/`
- **Purpose:** Project-specific assets (images, icons, etc.).

### `public/`
- **Purpose:** Static files served directly by Next.js (e.g., images, favicon).

---

## Configuration Files
- `.env.development`: Environment variables for development.
- `.eslintrc.json`: ESLint configuration for code linting.
- `next.config.mjs`: Next.js configuration.
- `postcss.config.mjs`: PostCSS configuration for CSS processing.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.

---

## How the Project Works

1. **Routing & Pages:**
   - The app uses Next.js's app directory structure for routing. Each folder in `src/app/(withCommonLayout)/` represents a route or feature page.
   - Layouts and error handling are managed via `layout.tsx`, `error.tsx`, and `not-found.tsx` files at various levels.

2. **State Management:**
   - Redux is used for global state management, with the store configured in `src/redux/store.tsx`.
   - Feature-specific state and API logic are organized in `src/redux/features/`.

3. **API Integration:**
   - API calls are managed via RTK Query or custom logic in `src/redux/features/api/`.
   - Each API file (e.g., `authApi.tsx`, `articleApi.tsx`) handles requests for a specific feature.

4. **UI Components:**
   - Reusable components are organized in `src/components/`, grouped by feature or type for maintainability.

5. **Styling:**
   - Tailwind CSS is used for utility-first styling, configured via `tailwind.config.ts`.
   - Global styles are imported in `src/app/globals.css`.

6. **Custom Hooks & Providers:**
   - Custom hooks in `src/hooks/` encapsulate reusable logic.
   - Context providers in `src/provider/` manage global context/state.

7. **Assets & Public Files:**
   - Static assets are placed in `public/` and `src/assets/`.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open the app:**
   Visit `http://localhost:3000` in your browser.

---

## Contributing

- Follow the existing code style and structure.
- Add new features in their own directories under `src/app/(withCommonLayout)/` or `src/components/` as appropriate.
- Update documentation as needed.

---

## License

This project is licensed under the MIT License.
