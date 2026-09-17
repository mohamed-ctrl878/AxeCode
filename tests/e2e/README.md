# E2E Tests (Playwright)

This is the first E2E test suite for the AxeCode frontend — previously
there was no E2E coverage at all, only Vitest unit tests under
`tests/useCases`. See the QA/scalability plan for the full context.

## What's covered so far

- `auth.spec.js` — login with valid credentials, and the error path for
  invalid credentials (no false-positive redirect, form re-enabled).
- `problems.spec.js` — the `/problems` catalog loads while authenticated,
  and opening a problem renders the workspace (Run/Submit, tabs, Monaco
  editor mounted).
- `courses.spec.js` — the `/courses` catalog loads while authenticated,
  and opening a course renders its details page.

**Not covered yet (intentionally, tracked separately):**
- Actual Judge0 code execution results (Run/Submit correctness) — needs
  seeded test problems with known-good solutions in a staging environment.
- The full purchase flow (checkout → Paymob/Kashier → entitlement granted
  → content unlocked) — needs sandboxed payment provider credentials.
- Live/Agora video call flows.

These are P0/P1 items in the QA plan and are meant to build on this setup,
not block it.

## Why every test logs in through the real UI

Every route except the landing page, auth pages, and legal pages is
wrapped in `ProtectedRoute` (see `src/presentation/routes/AppRoutes.jsx`),
so there is no "public" content to test against. Login itself requires
solving reCAPTCHA — the submit button on `LoginPage` stays disabled until
`recaptchaToken` is set, independently of the backend's `RECAPTCHA_REQUIRED`
flag. So automating login requires Google's own supported mechanism for
this: their public **test key pair**, which always verifies instantly
with no real challenge, and is documented for exactly this purpose.

## Required environment setup

1. **Frontend build config** — set the reCAPTCHA site key to Google's
   test key for whatever environment you run these tests against:
   ```
   VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
   ```
2. **Backend config** (`AxeCode_backend`) — set the matching test secret:
   ```
   RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
   ```
   **Never use this key pair in production** — anyone can pass it.
3. **A seeded test user** on that backend, then:
   ```
   E2E_TEST_USER_EMAIL=your-test-user@example.com
   E2E_TEST_USER_PASSWORD=your-test-password
   ```
4. Optionally, point tests at a non-default frontend URL:
   ```
   E2E_BASE_URL=http://localhost:5173
   ```

## Running locally

```bash
npx playwright install --with-deps chromium   # first time only
npm run test:e2e            # headless
npm run test:e2e:ui         # interactive UI mode, easiest for debugging
npm run test:e2e:report     # open the HTML report from the last run
```

`playwright.config.js` auto-starts `npm run dev` locally
(`reuseExistingServer: true`, so it won't conflict with a server you
already have running). In CI/staging, the app and backend are assumed to
already be deployed — see the "Full-Stack E2E" section of the QA plan for
the staging pipeline this is meant to plug into.
