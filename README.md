# FoodDash: Food Delivery Web App (Frontend)

FoodDash lets customers discover local restaurants in Dhaka, Chattogram and Sylhet, order in a few taps and track delivery, while restaurant owners list their kitchens and manage menus and admins moderate the marketplace.

| | Link |
|---|---|
| **Live website** | https://food-delivery-frontend-seven-gamma.vercel.app |
| **Live API** | https://food-delivery-backend-iota-kohl.vercel.app |
| **Backend repo** | https://github.com/Ebratul/Food_Delivery_backend |

## Demo accounts

Use the **Demo user** / **Demo admin** buttons on the login page, or:

| Role | Email | Password |
|---|---|---|
| User | `user@fooddash.app` | `User@1234` |
| Admin | `admin@fooddash.app` | `Admin@1234` |

## Features

- **Home page:** 60–70vh hero with an animated rotating word and live stats, auto-scrolling dish carousel, cuisines, featured restaurants, how it works, live statistics, popular dishes, review slider, partner call-to-action, blog preview, FAQ and newsletter. Every section uses API data.
- **Explore:** search, filters (cuisine, city, rating, price, delivery time, vegan), sorting and pagination, all server-side and synced to the URL; skeleton loaders; 4 cards per row on desktop.
- **Restaurant details (public):** photo gallery with lightbox, overview, key information, menu by section with add-to-cart, rating breakdown, paginated reviews with a review form, and related restaurants.
- **Cart & checkout:** single-restaurant cart, minimum-order check, checkout form, order tracking page.
- **Authentication:** register/login with client- and server-side validation, JWT, auto-logout when the token expires, protected and role-based routes, demo-login autofill.
- **User dashboard:** overview cards and bar/line/pie charts, my orders, my restaurants (create/edit/delete with image upload and menu manager), my reviews, profile (photo upload, password change).
- **Admin dashboard:** platform overview with charts, manage users, manage restaurants (approve/reject/feature), orders (status lifecycle), cuisines, and contact messages. Tables have pagination, filtering, sorting and actions.
- **Additional pages:** About, Contact (saved to the database), Blog and articles, Help center, Privacy Policy, Terms & Conditions, 404.

## Design system

Visual direction is inspired by [designmonks.co](https://www.designmonks.co): dark hero with a dotted grid, italic accent words, generous 96px section spacing, large rounded section containers and pill labels.

- **Colours:** brand violet `#7D40FF`, accent orange `#FF6A2B` and success emerald `#10B981`, plus a zinc neutral scale
- **Light & dark mode:** class-based, follows the system on first visit and is saved per browser; dark palette checked for contrast
- **Spacing:** 8px grid; sections use 64px (mobile) and 96px (desktop) padding
- **Radius:** a single `--radius-ui` (12px) shared by every component
- **Typography:** Red Hat Display (headings) and Outfit (body, 16/24); one type scale (`t-display`, `t-h2`, `t-h3`, `t-h4`)
- **Reusable components** (`src/components/ui`): Button, Input, Textarea, Select, Checkbox, Card, Badge, Modal, Dropdown, Table, Pagination, Skeleton, Rating, Avatar, Alert, EmptyState, ConfirmDialog

## Tech stack

React 19 · Vite 8 · Tailwind CSS 4 · React Router 8 · TanStack Query · React Hook Form + zod · Recharts · Axios · lucide-react · sonner

## Performance

- Every route is lazy-loaded (code splitting); vendor libraries are split into cacheable chunks (`react`, `data`, `forms`, `charts`)
- Images are lazy-loaded with explicit sizes; cards request smaller CDN variants (`/small`, `/medium`) and uploads are resized to WebP on the server
- Server data is cached with TanStack Query; list components are memoised
- Fonts are self-hosted (no render-blocking font requests); `console` calls are blocked by ESLint

## Getting started

```bash
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000 (the backend)
npm run dev               # http://localhost:5173
npm run build             # production build in dist/
npm run lint
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the FoodDash API, without a trailing slash |

## Project structure

```
src/
├── components/
│   ├── ui/            # design-system components
│   ├── layout/        # Navbar (mega menu, profile dropdown, mobile menu), Footer, layouts, route guards
│   ├── restaurant/    # RestaurantCard, Gallery, MenuSection, Reviews
│   ├── dashboard/     # charts, stat cards, table toolbar, image uploader
│   └── blog/
├── context/           # Auth (JWT expiry), Theme, Cart providers
├── hooks/             # useAuth, useCart, useTheme, useDebounce, useTableParams, useCountUp, useClickOutside, …
├── lib/               # API client, validation schemas, formatting helpers
├── pages/             # Home (+ sections), Explore, details, cart, auth, blog, static, dashboard (+ admin)
└── router.jsx         # lazy routes, protected and admin-only routes
```

## Deployment

Deployed on Vercel as a static SPA (`vercel.json` rewrites all routes to `index.html` and caches hashed assets for a year). `VITE_API_URL` is set to the production API in the Vercel project settings, so the production build contains no localhost references.
