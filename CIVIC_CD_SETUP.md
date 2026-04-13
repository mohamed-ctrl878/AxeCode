# AxeCode CI/CD Setup Guide (100% Free - No Credit Card)

To enable the professional CI/CD pipeline, you need to configure the following services. These choices were picked because they offer **Free Tiers without requiring a Credit Card**.

## 1. Vercel (Frontend Deployment)
Go to [Vercel Dashboard](https://vercel.com/dashboard).
1.  **Connect Repo**: Import your `AxeCode` GitHub repository.
2.  **Get Secrets**: Go to Settings -> Tokens to create a token.
    - **`VERCEL_TOKEN`**: Your Vercel Secret Token.
    - **`VERCEL_ORG_ID`**: Your Organization ID.
    - **`VERCEL_PROJECT_ID`**: Your Project ID.
**Add these 3 to GitHub Secrets** (Repository Settings -> Secrets and variables -> Actions).

## 2. Strapi Cloud (Backend Deployment)
Go to [Strapi Cloud](https://cloud.strapi.io).
1.  **Login**: Use your GitHub account.
2.  **Project**: Click "Create New Project" and select the Free Plan.
3.  **No Credit Card**: During registration, ensure you select the "Free Plan" which allows 1 project without billing information.
4.  **Connect Repo**: Select your backend repository.
5.  **Auto-Deploy**: Strapi Cloud will automatically deploy whenever you merge to your production branch.

## 3. JDoodle (Code Execution Engine - No Card Required)
We use JDoodle because it doesn't require a credit card for the free tier (200 executions/day).
1.  **Sign Up**: Go to [JDoodle Compiler API](https://www.jdoodle.com/compiler-api/).
2.  **Get Credentials**: Register for a free plan to get your `Client ID` and `Client Secret`.
3.  **Add to Cloud**: Add these as `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET` in your Strapi Cloud settings.

## 4. GitHub Feedback (PR Comments)
1.  **`GH_TOKEN`**: Create a **Fine-grained Personal Access Token** in GitHub Settings -> Developer settings.
    - **Permissions**: `Pull requests: Read & Write`.
**Add this to GitHub Secrets** as `GH_TOKEN`.

---

### How the Pipeline Works:
- **On Pull Request**: Runs Lint & Unit Tests. Posts a comment with the results.
- **On Merge to `develop`**: Deploys to Vercel (Preview) and notifies you of Strapi Cloud update.
- **On Merge to `main`**: Deploys to Vercel (Production) and Strapi Cloud (Live).

> [!IMPORTANT]
> Make sure to add all your `.env` variables (e.g., `APP_KEYS`, `JWT_SECRET`, `JDOODLE_CLIENT_ID`) in BOTH the Vercel Dashboard and Strapi Cloud Dashboard.
