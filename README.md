# GIT Challenge: API Testing Extension — Automation with Test Scripts

**Target API:** DummyJSON — https://dummyjson.com/docs

**Repository:** `QualityTechies/git-challenge-postman`

**Deadline:** Saturday 5th September 2026, 23:59 WAT (UTC+1) — end of day

**Task order & assigned features:** 

(https://docs.google.com/spreadsheets/d/1tP0R5HKIEVik2rtYdtUWqukhnEcDX2aY/edit?gid=1946907848#gid=1946907848) — find your name and your assigned feature before you start.
If you still wish to join request for request access on the sheet and update your name accross the next feture.

**Submission:** Pull request to `main`, plus your row on the assessment tracking sheet

---

## Study Material

install Postman and VScode

1. https://medium.com/@agboolaadenike88/git-for-qa-engineers-the-branching-strategy-nobody-taught-you-48786749d3b6

2.**Postman test scripting** — https://www.youtube.com/playlist?list=PLww5VpczsP-NLjmrWG-LllZ79MmHq1oMW
   _Covers writing assertions in Postman and running collections from the CLI._
2. **OWASP API Security Top 10:** https://owasp.org/www-project-api-security/

---

## Read This First: How DummyJSON Behaves

**Writes are simulated. Nothing you create, update or delete actually persists.**

`POST /products/add`, `PUT /products/1` and `DELETE /products/1` all return a response that looks successful — a new ID, the modified fields, an `isDeleted` flag — but the server state never changes. Send a GET straight afterwards and you get the original record back.

This is not a bug you should report. It is a documented property of the API, and it changes how you must write your tests:

- **Do not** assert that a created record can be fetched by its new ID. It cannot.
- **Do** assert that the response *echoes back* what you sent, with the correct shape, status code and generated ID.
- **Do** treat "GET after POST returns the original data" as **expected** behaviour for this API, and note it in your README.

Understanding the difference between a mocked write and a real one is part of what this challenge is assessing.

---

## Objectives

- Automate API testing using Postman **pre-request** and **post-response** scripts (the tab formerly called "Tests").
- Execute the suite from the command line with Newman and generate reports.
- Validate status codes, response body structure, schema, and error handling.
- Probe authentication and authorisation behaviour.
- Measure and record response times.

---

## Requirements

### 1. Variables

- Put non-secret values — `baseUrl`, resource IDs, default query parameters — in **collection variables**, so the collection runs for anyone who clones the repo.
- Put credentials and tokens in an **environment file that is gitignored**, or pass them at run time with `newman --env-var`. Collection variables are saved inside the collection JSON and therefore committed to the repository — a token stored there is a leaked credential, which is exactly what the OWASP material warns against.
- Never hardcode a base URL or an ID inside a request.

### 2. Test Scripts

- Write assertions in JavaScript inside `pm.test()` blocks.
- Generate dynamic test data with Postman's built-in **dynamic variables**, which are powered by Faker. In a script, resolve them like this:

  ```javascript
  const firstName = pm.variables.replaceIn('{{$randomFirstName}}');
  const email     = pm.variables.replaceIn('{{$randomEmail}}');
  ```

  Note: Postman implements a subset of the Faker library, not all of it. There is no `require('faker')` in the sandbox — if a variable you expect does not resolve, it is not supported.
- Chain values between requests with `pm.collectionVariables.set()`.
- Validate response structure with a schema assertion (`ajv` and `tv4` are both available in the sandbox), not only field-by-field checks.

### 3. Newman Execution & Reporting (Optional)
Attach your report - with your name saved
Install once:

```bash
npm install -g newman newman-reporter-htmlextra
```

Run:

```bash
newman run collections/dummyjson.postman_collection.json \
  --reporters cli,json,htmlextra \
  --reporter-json-export reports/newman-report.json \
  --reporter-htmlextra-export reports/newman-report.html
```

The HTML reporter is a separate npm package — Newman does not ship with it. Commit the `reports/` folder; add `node_modules/` to `.gitignore`.

---

## Test Scenarios

Work on **the feature you have been assigned** — do not pick your own. Your assigned resource and module are listed on the assessment tracking sheet. Cover it properly; depth beats breadth.

### CRUD
- `GET` collection — pagination (`limit`, `skip`), `total` field, array length, item schema.
- `GET` single by ID — correct record returned.
- `GET` non-existent ID — 404 with a message in the body.
- `POST /add` — correct status, generated ID present, submitted fields echoed back.
- `PUT` / `PATCH` — only the fields you sent come back modified.
- `DELETE` — `isDeleted` and `deletedOn` present in the response.
- Search and filter endpoints where the resource supports them.

### Error Handling
- Malformed JSON body.
- Missing required fields.
- Invalid data types (string where a number is expected).
- Invalid query parameters.
- Unsupported HTTP method on a valid path.

### Response Time
- Assert a threshold on each request, but pick a realistic one. DummyJSON is a shared free service on the public internet — 500 ms will fail intermittently for reasons that have nothing to do with the API. Assert **2000 ms** as the hard limit, log the actual figure, and report the median from your Newman run.

---

## Deliverables

1. **Collection** — `collections/<resource>.postman_collection.json`, with pre-request and post-response scripts.
2. **Newman reports** — `reports/newman-report.json` and `reports/newman-report.html`.
3. **README.md** — how to install, how to run, which feature you were assigned, what you deliberately left out, and what you would add with more time.
4. **Bug report** — `BUGS.md`, using the format below. Remember that simulated writes are not bugs.

### Bug Report Format

| Field | Content |
|---|---|
| ID | BUG-01 |
| Title | One line, describes the failure not the fix |
| Endpoint | `POST /products/add` |
| Severity | Critical / High / Medium / Low |
| Steps to reproduce | Numbered, with the exact request body |
| Expected result | With a reference to the documentation |
| Actual result | Status code and response body |
| Evidence | Screenshot or Newman log excerpt |

---

## What to Submit

### Step 1 — Fork on GitHub

Go to https://github.com/QualityTechies/git-challenge-postman and click **Fork**. Forking happens in the browser; there is no `git fork` command, and cloning is not forking.

### Step 2 — Clone your fork

```bash
git clone https://github.com/<your-github-username>/git-challenge-postman.git
cd git-challenge-postman
```

A cloned repository is already a Git repository with `origin` already configured. **Do not run `git init`** and **do not run `git remote add origin`** — the first creates a nested repository, the second fails with "remote origin already exists".

### Step 3 — Create your branch before you start working

```bash
git switch -c feature/auth-valid-login
```

Branch names cannot contain spaces. Use hyphens: `feature/auth-valid-login`, `feature/products-crud`, `feature/error-handling`.

### Step 4 — Do the work, then commit

Edit `CONTRIBUTORS.md` and add your line:

```
- Your Name | @github-handle | one thing you contributed to this challenge
```

Then:

```bash
git add CONTRIBUTORS.md collections/ reports/ BUGS.md README.md
git commit -m "test: add auth login assertions and Newman reports"
```

Note the filename is **CONTRIBUTORS.md**, plural. Make at least two meaningful commits — a single "first commit" containing everything scores poorly on Git hygiene.

### Step 5 — Push

```bash
git push -u origin feature/auth-valid-login
```

### Step 6 — Open a pull request

From your fork on GitHub, open a PR into `QualityTechies/git-challenge-postman`, branch `main`. In the PR description, state your assigned feature, how many assertions you wrote, and any bug you found. Then add your row to the assessment tracking sheet.

---

## Important: Working Alongside Everyone Else

**Watch for the first bug report to be uploaded.** Once someone pushes `BUGS.md`, that file becomes the shared one. Add your findings to it rather than creating your own — and read what is already there before you report, so we do not collect the same defect five times under five different IDs.

**Pull before you start work. Every single time.** The repository moves while you are away from it. If you branch off a stale copy, you will spend your time resolving conflicts instead of writing tests.

Working from a fork, you need a link back to the original repository. Set it up once:

```bash
git remote add upstream https://github.com/QualityTechies/git-challenge-postman.git
```

Then run this at the start of every working session:

```bash
git switch main
git pull upstream main          # get everyone else's merged work
git switch feature/your-branch
git merge main                  # bring it into your branch
```

If you are on the single shared repository instead of a fork, drop the `upstream` step — `git pull` on `main` is enough.

**Then work as normal:** commit on your feature branch, `git push`, and raise your PR. Never commit directly to `main`, and never push someone else's branch.

If your PR shows a conflict on GitHub, do not open a second PR. Pull `main` again, resolve the conflict locally on your feature branch, and push — the existing PR updates itself.

---

## Alternative: Single Shared Repository

If you would rather everyone work in one repository instead of forking, the flow changes:

1. You are added as a collaborator on `QualityTechies/git-challenge-postman`.
2. `git clone https://github.com/QualityTechies/git-challenge-postman.git`
3. `git switch -c feature/<your-branch>`
4. Commit and `git push -u origin feature/<your-branch>`
5. Open the PR inside the same repository.

**Pick one model and delete the other.** Mixing them — forking one repository and pushing to a different one — is what produces the "remote origin already exists" and "permission denied" errors that stall people on day one.

---

## Get All Products Categories by Michael Adeyeye
### Assigned Feature
I was assigned the Get-all-Products-categories endpoint `GET /products/categories` of the DummyJSON API. My scope covered building an automated Postman/Newman test suite for this endpoint, including positive tests, negative tests, schema validation, and comprehensive reporting.

---
### Installation
1. Clone the repository `git clone https://github.com/QualityTechies/git-challenge-postman.git`. 
- **You should have already been added as a collaborator**
2. Switch from the main repo to your created repo `git switch -c feature/get-All-Products-Categories`
3. Download the `DummyJson -QualityTechies.postman_collection.json` to your local storage and import to Postman
4. On Postman,using the imported JSON file as a guide, I created the test scripts(pre-requests and post-requests), test scenarios for error handling and validated JSON response using `ajv` schema assertion. 
5. Installed Newman and generated the reports on the CLI with one command

```bash
newman run GetAllProductcategories.postman_collection.json \
  --reporters cli,json,htmlextra \
  --reporter-json-export getAllProductcategories-reports/newman-report.json \
  --reporter-htmlextra-export getAllProductcategories-reports/newman-report.html
```
6. The generated reports `newman-report.json` and `newman-report.html` displayed details such as 
- **Total iterations**
- **Total Assertions**
- **Total failed tests**
- **Total Skipped tests**
- **Total run duration**
- **Total data received**
- **Average/median response time**.
---
**N.B: All these and more information about the tests are also printed on the CLI**


---

### What I Deliberately left out
- **Authentication/Authorisation flow**: It is beyond the scope of my assigned tasks
- **Write-endpoint testing** `(POST, PUT, DELETE on /products)` : not applicable to a GET-only categories endpoint. Out of scope

---

### Proposed Features to be added
- **CI integration**: run this test suite automatically on every push/PR via GitHub Actions, failing the build on test failures and publishing the HTML and JSON reports as a build artifact.
- **Response time regression tracking**: Response time is checked against a fixed threshold per run. I would like to track median/average response times across runs to catch performance regressions over time rather than just a single-run snapshot.