# Deployment (library-frontend)

| What | Where | Pipeline |
|---|---|---|
| Static SPA (QA) | GitHub Pages: `https://<owner>.github.io/library-frontend/` | `.github/workflows/ci-cd.yml` → `deploy-pages` → `smoke-qa` |

The deploy runs only on `main` (push or manual "Run workflow"), after lint, unit tests, build, audit, the **contract
check** and the UI tests have passed. The backend is deployed separately from
[library-backend](https://github.com/storyrail-squad/library-backend).

## One-time setup

### 1. GitHub Pages (QA environment)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Run the **Frontend CI/CD** workflow on `main` (Actions → Frontend CI/CD → Run workflow), or push to `main`.
3. The site is at `https://<owner>.github.io/library-frontend/`. Vite builds with `base: './'` and the app uses
   `HashRouter` (`#/`, `#/books/new`), so it works under the repository sub-path with no 404 fallback.

By default the Pages build runs in **demo mode** (in-browser mock API, "Demo data" badge). See step 2 to point it at
the live backend.

### 2. Point Pages at the live backend

Add the repository **variable** `API_BASE_URL` = the backend's QA URL (library-backend's `BACKEND_URL`), then re-run the
Frontend CI/CD workflow. The Pages build passes it as `VITE_API_BASE_URL`. Delete the variable to return to demo mode.

### 3. Contract source

The `contract` job compares `contract/openapi.yaml` with the backend's contract on `main`. By default it reads
`https://raw.githubusercontent.com/storyrail-squad/library-backend/main/docs/api/openapi.yaml`; set the repository
variable `CONTRACT_URL` to use another source (another fork, or a GitLab raw URL at the office).

### 4. SonarCloud (optional)

1. Import the repository at sonarcloud.io. The organization key must equal the GitHub owner and the project key
   `<owner>_<repo>` (the defaults SonarCloud proposes); the workflow passes both.
2. Turn off **Automatic Analysis** for the project (CI analysis replaces it).
3. Add the secret `SONAR_TOKEN`. The `sonarcloud` job in `security.yml` then runs the unit tests for coverage and
   uploads using `sonar-project.properties`. Without the secret it is skipped.

## Secrets and variables

| Name | Kind | Needed for | Required |
|---|---|---|---|
| `API_BASE_URL` | variable | Pages build against the live API | no (demo mode) |
| `CONTRACT_URL` | variable | `contract` job | no (defaults to library-backend on GitHub) |
| `SONAR_TOKEN` | secret | `sonarcloud` job | no |
| `GITLEAKS_LICENSE` | secret | `gitleaks` job | only if the repo is owned by an organization |

Also enable **Settings → Code security → Dependency graph** for `dependency-review`.
