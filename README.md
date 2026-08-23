GIT Challenge: API Testing Extension — Automation with Test Scripts

Target API: DummyJSON — https://dummyjson.com/docs Repository: QualityTechies/git-challenge-postman Deadline: [set a date and time, with timezone] Submission: Pull request to main, plus your row on the assessment tracking sheet

Study Material
Postman test scripting — https://www.youtube.com/playlist?list=PLww5VpczsP-NLjmrWG-LllZ79MmHq1oMW Covers writing assertions in Postman and running collections from the CLI.
Postman docs — dynamic variables: https://learning.postman.com/docs/tests-and-scripts/write-scripts/variables-list
Newman docs: https://github.com/postmanlabs/newman
OWASP API Security Top 10: https://owasp.org/www-project-api-security/
Read This First: How DummyJSON Behaves

Writes are simulated. Nothing you create, update or delete actually persists.

POST /products/add, PUT /products/1 and DELETE /products/1 all return a response that looks successful — a new ID, the modified fields, an isDeleted flag — but the server state never changes. Send a GET straight afterwards and you get the original record back.

This is not a bug you should report. It is a documented property of the API, and it changes how you must write your tests:

Do not assert that a created record can be fetched by its new ID. It cannot.
Do assert that the response echoes back what you sent, with the correct shape, status code and generated ID.
Do treat "GET after POST returns the original data" as expected behaviour for this API, and note it in your README.

Understanding the difference between a mocked write and a real one is part of what this challenge is assessing.

Objectives
Automate API testing using Postman pre-request and post-response scripts (the tab formerly called "Tests").
Execute the suite from the command line with Newman and generate reports.
Validate status codes, response body structure, schema, and error handling.
Probe authentication and authorisation behaviour.
Measure and record response times.
Requirements
1. Variables
Put non-secret values — baseUrl, resource IDs, default query parameters — in collection variables, so the collection runs for anyone who clones the repo.
Put credentials and tokens in an environment file that is gitignored, or pass them at run time with newman --env-var. Collection variables are saved inside the collection JSON and therefore committed to the repository — a token stored there is a leaked credential, which is exactly what the OWASP material warns against.
Never hardcode a base URL or an ID inside a request.
2. Test Scripts
Write assertions in JavaScript inside pm.test() blocks.
Generate dynamic test data with Postman's built-in dynamic variables, which are powered by Faker. In a script, resolve them like this:
javascript
  const firstName = pm.variables.replaceIn('{{$randomFirstName}}');
  const email     = pm.variables.replaceIn('{{$randomEmail}}');

Note: Postman implements a subset of the Faker library, not all of it. There is no require('faker') in the sandbox — if a variable you expect does not resolve, it is not supported.

Chain values between requests with pm.collectionVariables.set().
Validate response structure with a schema assertion (ajv and tv4 are both available in the sandbox), not only field-by-field checks.
3. Newman Execution & Reporting

Install once:

bash
npm install -g newman newman-reporter-htmlextra

Run:

bash
newman run collections/dummyjson.postman_collection.json \
  --reporters cli,json,htmlextra \
  --reporter-json-export reports/newman-report.json \
  --reporter-htmlextra-export reports/newman-report.html

The HTML reporter is a separate npm package — Newman does not ship with it. Commit the reports/ folder; add node_modules/ to .gitignore.

Test Scenarios

Pick one resource from the DummyJSON docs (products, users, posts, carts, todos, recipes) and cover it properly. Depth beats breadth.

CRUD
GET collection — pagination (limit, skip), total field, array length, item schema.
GET single by ID — correct record returned.
GET non-existent ID — 404 with a message in the body.
POST /add — correct status, generated ID present, submitted fields echoed back.
PUT / PATCH — only the fields you sent come back modified.
DELETE — isDeleted and deletedOn present in the response.
Search and filter endpoints where the resource supports them.
Error Handling
Malformed JSON body.
Missing required fields.
Invalid data types (string where a number is expected).
Invalid query parameters.
Unsupported HTTP method on a valid path.
Authentication & Security

Use the /auth endpoints:

POST /auth/login with valid credentials — token returned.
POST /auth/login with a wrong password, an unknown user, and an empty body.
GET /auth/me with a valid token, with no token, with an expired or malformed token.
Confirm that error responses do not leak stack traces, internal paths, or whether a username exists.
Response Time
Assert a threshold on each request, but pick a realistic one. DummyJSON is a shared free service on the public internet — 500 ms will fail intermittently for reasons that have nothing to do with the API. Assert 2000 ms as the hard limit, log the actual figure, and report the median from your Newman run.

Load testing is out of scope. Newman iterations are not a load test, and pointing volume traffic at a free shared service is abuse. If you want to explore performance, note in your README what you would run (k6, JMeter, Gatling) against an API you control.

Deliverables
Collection — collections/<resource>.postman_collection.json, with pre-request and post-response scripts.
Newman reports — reports/newman-report.json and reports/newman-report.html.
README.md — how to install, how to run, which resource you covered, what you deliberately left out, and what you would add with more time.
Bug report — BUGS.md, using the format below. Remember that simulated writes are not bugs.
Bug Report Format
Field	Content
ID	BUG-01
Title	One line, describes the failure not the fix
Endpoint	POST /products/add
Severity	Critical / High / Medium / Low
Steps to reproduce	Numbered, with the exact request body
Expected result	With a reference to the documentation
Actual result	Status code and response body
Evidence	Screenshot or Newman log excerpt
What to Submit
Step 1 — Fork on GitHub

Go to https://github.com/QualityTechies/git-challenge-postman and click Fork. Forking happens in the browser; there is no git fork command, and cloning is not forking.

Step 2 — Clone your fork
bash
git clone https://github.com/<your-github-username>/git-challenge-postman.git
cd git-challenge-postman

A cloned repository is already a Git repository with origin already configured. Do not run git init and do not run git remote add origin — the first creates a nested repository, the second fails with "remote origin already exists".

Step 3 — Create your branch before you start working
bash
git switch -c feature/auth-valid-login

Branch names cannot contain spaces. Use hyphens: feature/auth-valid-login, feature/products-crud, feature/error-handling.

Step 4 — Do the work, then commit

Edit CONTRIBUTORS.md and add your line:

- Your Name | @github-handle | one thing you contributed to this challenge

Then:

bash
git add CONTRIBUTORS.md collections/ reports/ BUGS.md README.md
git commit -m "test: add auth login assertions and Newman reports"

Note the filename is CONTRIBUTORS.md, plural. Make at least two meaningful commits — a single "first commit" containing everything scores poorly on Git hygiene.

Step 5 — Push
bash
git push -u origin feature/auth-valid-login
Step 6 — Open a pull request

From your fork on GitHub, open a PR into QualityTechies/git-challenge-postman, branch main. In the PR description, state which resource you covered, how many assertions you wrote, and any bug you found. Then add your row to the assessment tracking sheet.

Alternative: Single Shared Repository

If you would rather everyone work in one repository instead of forking, the flow changes:

You are added as a collaborator on QualityTechies/git-challenge-postman.
git clone https://github.com/QualityTechies/git-challenge-postman.git
git switch -c feature/<your-branch>
Commit and git push -u origin feature/<your-branch>
Open the PR inside the same repository.

Pick one model and delete the other. Mixing them — forking one repository and pushing to a different one — is what produces the "remote origin already exists" and "permission denied" errors that stall people on day one.
