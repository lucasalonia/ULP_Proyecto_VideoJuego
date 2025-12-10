<!-- .github/copilot-instructions.md - guidance for AI coding agents working on this repository -->
# Copilot / AI Agent Instructions — ULP_Proyecto_VideoJuego

This file gives targeted, actionable guidance to code-completion and AI coding agents so they can be productive immediately in this Node/Express project.

- **Entry point**: `src/app.js` — the Express server bootstrap. New routes and middleware should be wired here.
- **Main responsibilities**: `routes/` define URL surface (thin); `controllers/` contain request handlers and business logic; `models/` encapsulate DB access; `services/` (e.g. `src/Services/authService.js`) contain reusable logic like password hashing and authentication.

**Big picture / architecture**
- **Stack**: Node.js + Express + Pug for views, MySQL accessed through `mysql2` (pool in `src/config/db.js`). `package.json` scripts: `npm start` runs `node src/app.js`, `npm run dev` uses `nodemon`.
- **Session vs JWT**: `express-session` is configured in `src/app.js` and JWTs are used/verified in `src/middlewares/authMiddleware.js`. The middleware `verifyToken` reads `Authorization` header or cookie `jwt_token` and redirects unauthenticated users to `/login`.
- **View layer**: Pug templates under `src/views` and static assets under `src/public` (JS/CSS/image assets used by the game UI).

**Important files to inspect for changes**
- `src/app.js` — where middleware ordering matters (login routes are mounted before `verifyToken`).
- `src/config/db.js` — exports a `mysql2/promise` pool; use `pool.query(...)` or `pool.execute(...)` for DB access.
- `src/Services/authService.js` — uses `bcrypt` and helper functions; follow existing API (`authenticateUser`, `hashPassword`, `comparePassword`).
- `src/middlewares/authMiddleware.js` — token verification and `authorize(role)` helper; honor existing redirect behavior for public routes (`/login`, `/guest`, `/register`).

**Coding conventions & patterns (project-specific)**
- Route handlers are single-responsibility: `routes/*.js` only mount routes and pass control to `controllers/*` — prefer modifying controllers for business logic.
- Templates expect certain `locals` made available by `src/middlewares/contextMiddleware.js`. Keep context mutations minimal and additive.
- DB layer: raw SQL via `mysql2` pool is used directly (not Sequelize models). Use parameterized queries and `pool.query(sql, params)` to avoid injection.
- Passwords and auth: follow existing `authService` functions and store `password_hash` field names as used in `authService` (`user.password_hash`).

**Developer workflows & commands**
- Start dev server: `npm run dev` (nodemon). Production/dev: `npm start`.
- Environment: project uses `.env` for DB and JWT secrets — do not hardcode secrets. Keys expected: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE`, `PORT`.

**Integration points & external dependencies**
- MySQL via `mysql2` and a `createPool` in `src/config/db.js`.
- `bcrypt` for password hashing.
- JWT (`jsonwebtoken`) for token handling — verify using `ISSUER`/`AUDIENCE` values from env.

**What to do when changing routes or auth**
- If adding public routes (login/register/guest), mount them before `verifyToken` in `src/app.js`.
- If modifying authorization rules, update `src/middlewares/authMiddleware.js` and ensure controllers expect `req.user` to be the JWT payload.

**Examples (follow these patterns)**
- Reading pool: `const pool = require('./config/db'); const [rows] = await pool.query('SELECT ...', [params]);`
- Using `authService`: `const { authenticateUser } = require('../Services/authService'); const user = await authenticateUser(email, pass);`

**Safety & non-goals**
- Do not add secrets or credentials to the repository. Use `.env` and document required keys instead.
- Avoid changing middleware ordering without verifying the effects on login and static assets.

If anything in these instructions is unclear or you'd like me to expand sections (examples for controllers, common SQL patterns, or the Pug context shape), tell me which area to expand and I'll iterate.
