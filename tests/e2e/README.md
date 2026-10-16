# AxeCode Full-Coverage E2E Test Suite (Playwright)

Comprehensive End-to-End test suite covering all functional modules of the AxeCode platform across real backend, database, and execution engine components.

## Test Modules & Coverage

1. **`auth.spec.js` — Authentication & Lifecycle**
   - Valid login with credentials + Google reCAPTCHA test bypass.
   - Invalid login handling, error notification, and form reset.
   - Multi-step registration flow (Credentials -> Personal Info -> OTP Verification screen).
   - Sign Out / Logout session termination and redirection.

2. **`problems.spec.js` — Problems & Judge0 Code Execution**
   - Catalog browsing and problem list display.
   - Problem workspace: Monaco editor mounting, language selection, tabs.
   - Code execution (`Run`): runs code against sample test cases via Judge0.
   - Code submission (`Submit`): evaluates solution against all test cases with verdict banner.

3. **`courses.spec.js` — Courses & Learning Journey**
   - Catalog browsing and course listings.
   - Course details view, curriculum, and lesson outlines.
   - Free enrollment / Continue Learning navigation to lesson player.

4. **`articles.spec.js` — Community & Knowledge Sharing**
   - Articles and community feed listing.
   - Reading article details.
   - Writing and publishing new articles via the rich article editor.

5. **`events.spec.js` — Events & Workshops**
   - Upcoming and past events catalog.
   - Event details and registration.

6. **`projects.spec.js` — Projects & Workspaces**
   - Community project discovery.
   - Project dashboard and Kanban task view.

7. **`roadmaps.spec.js` — Learning Roadmaps**
   - Structured career and skills roadmaps catalog.
   - Roadmap details and interactive pathway nodes.

8. **`wallet.spec.js` — Wallet & Financials**
   - User wallet balance, available/pending funds, and currency display.

9. **`cms.spec.js` — Content Management & Access Control**
   - Role-based protection: ensures non-publisher student accounts cannot access `/cms`.

## Staging Environment & Automatic Seeding

In the staging environment (CI/CD self-hosted runner), tests run against an ephemeral Docker stack (Strapi, Postgres, Redis, Judge0).
Data is automatically seeded via `scripts/staging-seed-data.sql`, ensuring that tests always have real, reproducible data (problems with test cases, courses, lessons, articles, events, roadmaps, projects, and wallets) without needing manual setup.

## Running Locally

```bash
npx playwright install chromium    # first time only
npm run test:e2e                   # run all tests headless
npm run test:e2e:ui                # run in interactive UI mode
npm run test:e2e:report            # view the latest HTML test report
```
