# Bingeo — Stream Without Limits (Client)

A modern, high-performance OTT platform client and admin dashboard. Built with a focus on user experience, professional testing standards, and accessibility.

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Routing**: TanStack Router (Type-safe routing)
- **State Management**: Zustand
- **Styling**: Vanilla CSS & Tailwind CSS (Modern aesthetics)
- **Icons**: Lucide React
- **Testing**:
  - **Unit/Integration**: Vitest & React Testing Library
  - **E2E**: Playwright
  - **API Mocking**: MSW (Mock Service Worker)

---

## Folder Structure

The project follows a **Feature-Based Architecture** to ensure scalability and maintainability.

```bash
client/
├── e2e/                     # Playwright End-to-End tests
├── src/
│   ├── app/                # Global providers and router configuration
│   ├── components/         # Reusable UI components (Input, Modal, etc.)
│   ├── features/           # Domain-specific logic (e.g., admin, content)
│   │   └── admin/          # Admin dashboard, uploads, and analytics
│   ├── services/           # API clients and backend configurations
│   ├── stores/             # Zustand global state (Auth, UI, etc.)
│   ├── test/               # Centralized testing mocks, setup, and utils
│   │   ├── mocks/          # MSW handlers and server setup
│   │   └── test-utils.tsx  # Custom render wrapper with providers
│   ├── types/              # Global TypeScript interfaces
│   └── utils/              # Shared helper functions (formatting, cn)
├── public/                 # Static assets
└── package.json            # Scripts and dependencies
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (Recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## Development Workflow

To maintain a clean and stable codebase, follow this professional workflow for all changes.

#### Pre-push Check

Before pushing any code, run the local CI suite from the project root:

```bash
./scripts/client-ci.sh
```

This script automates: **Cleanup -> Install -> Lint -> Type-check -> Build -> Unit Test -> E2E Test**.

### 1. Branching Strategy

We use a feature-branch workflow. Always branch off `develop` (or `main` if `develop` isn't available) for new work.

- **Feature**: `feat/description-of-feature`
- **Bug Fix**: `fix/issue-description`
- **Refactor**: `refactor/component-name`
- **Documentation**: `docs/update-area`

```bash
git checkout -b feat/user-profiles
```

### 2. Implementation Steps

When building a new feature (e.g., "User Profiles"):

1.  **Define Types**: Create `src/features/user-profiles/types/profiles.types.ts`.
2.  **Mock Data**: Add initial mock data in `src/features/user-profiles/data/mockProfiles.ts`.
3.  **State/Store**: Create a Zustand store in `src/features/user-profiles/stores/profiles.store.ts`.
4.  **UI Components**: Build small, reusable components in `src/features/user-profiles/components/`.
5.  **Page**: Assemble everything in `src/features/user-profiles/pages/ProfilesPage.tsx`.
6.  **Routing**: Register the new route in `src/app/router.tsx`.

### 3. Commit Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/).

- `feat(profiles): add avatar upload functionality`
- `fix(auth): resolve session timeout on mobile safari`
- `test(admin): add E2E coverage for content drafts`

---

## Testing Workflow

We maintain a strict testing standard covering unit, integration, and E2E layers.

### Unit & Integration (Vitest)

Unit tests ensure individual logic and components work as expected. They are centralized in `src/test`.

- **Run all tests**: `pnpm test`
- **UI Mode**: `pnpm test:ui` (Recommended for debugging)
- **Coverage**: `pnpm test:coverage`

**How to add a test case:**

1. Create a file matching `src/test/**/*.test.ts(x)`.
2. Use `@/test/test-utils` for components requiring context (Theme, Auth, Router).
3. If the component calls an API, add a handler in `src/test/mocks/handlers.ts`.

### End-to-End (Playwright)

E2E tests verify the "happy path" and critical safety checks in a real browser context.

- **Run E2E**: `pnpm test:e2e`
- **UI Mode**: `pnpm test:e2e:ui`
- **Show Report**: `pnpm test:e2e:report`

**Guidelines:**

- **Viewport Handling**: Use `performLogin(page)` and standard locators like `getByRole` to support both Desktop and Mobile viewports automatically.
- **Locators**: Prefer stable IDs (`id="content-title"`) over fragile CSS classes.
- **Assertions**: Always ensure visibility assertions are filtered by `.filter({ visible: true })` if elements appear in both mobile nav and desktop sidebar.

---

## Coding Standards

1. **Accessibility (A11y)**:
   - Always use semantic HTML (`<main>`, `<nav>`, `<button>`).
   - Associate labels with inputs using `htmlFor` and unique `id`s.
   - Provide `<title>` for SVGs and `aria-label` for icon-only buttons.

2. **Styling**:
   - Use the `cn` utility for conditional classes.
   - Prioritize CSS variables for themes (`data-admin-theme`).

3. **Type Safety**:
   - Avoid `any`. Define interfaces in `features/[feature]/types` or the global `types/`.
   - Use TanStack Router's type-safe hooks (`useNavigate`, `useSearch`).

4. **API Interaction**:
   - Define MSW handlers in `src/test/mocks/handlers.ts` for any new backend endpoints to support testing.

---

## License

This project is proprietary. All rights reserved.
