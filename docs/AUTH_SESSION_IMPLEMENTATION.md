# Authentication and Session Management

Technical reference for the auth system: JWT tokens, HttpOnly cookies, session persistence, and token refresh.

## Architecture overview

The system uses a hybrid approach: **HttpOnly cookies** (primary) with **Bearer token header** (fallback for backward compatibility).

```
Frontend (React)                                Backend (NestJS)
      |                                               |
      |-- POST /auth/login { email, password } ------>|
      |<-- Set-Cookie: access_token, refresh_token ---|
      |<-- JSON: { user }                             |
      |                                               |
      |-- GET /api/resource (cookies sent auto) ----->|
      |                                               |
      |<-- 401 (token expired) ----------------------|
      |                                               |
      |-- POST /auth/refresh-token (cookie auto) ---->|
      |<-- Set-Cookie: new access_token, refresh_token|
      |                                               |
      |-- Retry: GET /api/resource ------------------>|
```

## Tokens

| Token | Type | Lifetime | Storage |
| --- | --- | --- | --- |
| Access token | JWT (HS256) | 24 hours | HttpOnly cookie + localStorage (fallback) |
| Refresh token | Random hex (80 chars) | 7 days | HttpOnly cookie + MongoDB |

## Backend (NestJS)

### Cookie configuration

```typescript
res.cookie('access_token', token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
});
```

### JWT strategy extraction priority

1. HttpOnly cookie (`req.cookies.access_token`)
2. Authorization header (`Bearer <token>`)
3. Query string (`?token=xxx` -- for SSE/EventSource)

### Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/auth/login` | POST | Validate credentials, set cookies, return user JSON |
| `/auth/refresh-token` | POST | Read refresh cookie, rotate tokens, set new cookies |
| `/auth/logout` | POST | Clear cookies |
| `/auth/me` | GET | Return authenticated user (JWT guard) |

### Refresh token rotation

Each refresh token is single-use. On refresh, the old token is revoked in the database and a new pair is generated.

## Frontend (React)

### API client (`services/apiClient.ts`)

- `withCredentials: true` on Axios ensures cookies are sent automatically
- **Request interceptor**: adds `Authorization: Bearer <token>` from localStorage (fallback)
- **Response interceptor**: handles 401 by attempting token refresh
- Dedicated `refreshClient` (no interceptors) prevents infinite loops
- Failed requests queue during refresh, then replay after success
- On refresh failure: clears auth, redirects to `/login`

### Auth store (`stores/auth.ts`)

Zustand with `persist` middleware. Stores `user`, `token`, `isAuthenticated`.

Authentication calculation:
- If `user` exists and `token` is null -> HttpOnly cookies (Google OAuth)
- If `user` and `token` both exist -> local login (Bearer fallback)
- If `user` is null -> not authenticated

### Auth hook pattern

```typescript
// hooks/useAuth.ts
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: getCurrentUser,  // GET /auth/me
  retry: false,
  staleTime: 0,
});
```

On mount, `useAuth` calls `GET /auth/me`. If cookies are valid, the user is returned. If expired, the interceptor refreshes automatically.

### Protected routes

`ProtectedRoute` component checks `isAuthenticated` and `isLoading`. Shows loading screen during auth check, redirects to `/login` if unauthenticated.

## Session flows

### Login

1. User submits email/password
2. Backend validates, generates JWT + refresh token, sets cookies
3. Frontend receives user JSON, updates Zustand store, redirects to dashboard

### Auto-login (page reload)

1. Browser has cookies from previous session
2. Zustand rehydrates from localStorage (stale user data)
3. `useAuth` fires `GET /auth/me` with cookies
4. Backend validates JWT, returns current user
5. Store updated with fresh data

### Token refresh (transparent)

1. API request returns 401
2. Interceptor sets `isRefreshing = true`, queues other failing requests
3. `POST /auth/refresh-token` with cookie
4. Backend rotates tokens, sets new cookies
5. Interceptor replays queued requests
6. User never sees the refresh

### Logout

1. `POST /auth/logout` clears cookies on backend
2. Frontend clears Zustand stores, React Query cache, localStorage
3. Redirect to `/login`

## Security properties

| Property | Value | Purpose |
| --- | --- | --- |
| `httpOnly` | `true` | Prevents XSS from reading cookies |
| `secure` | `true` (production) | HTTPS only |
| `sameSite` | `lax` | Basic CSRF protection |
| `path` | `/` | Available on all routes |
| CORS `credentials` | `true` | Allows cross-origin cookies |
| CORS `origin` | `FRONTEND_URL` | Not wildcard (required with credentials) |

## Remember Me

Controls where the Bearer fallback token is stored:

| Setting | Storage | Behavior |
| --- | --- | --- |
| Remember Me on | localStorage | Persists across browser sessions |
| Remember Me off | sessionStorage | Cleared when tab closes |

Note: HttpOnly cookies persist regardless of this setting (controlled by `maxAge`).
