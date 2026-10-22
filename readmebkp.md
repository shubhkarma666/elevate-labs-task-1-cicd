# Elevate Labs Task 1: CI/CD Pipeline with GitHub Actions

## 1. Project Overview

This project demonstrates an automated CI/CD pipeline for a Node.js web application using GitHub Actions, Docker, and Docker Hub.

When code is pushed to the `main` branch, GitHub Actions runs automated tests. If the tests pass, it builds a Docker image and pushes the image to Docker Hub.

**Repository:** [https://github.com/shubhkarma666/elevate-labs-task-1-cicd](https://github.com/shubhkarma666/elevate-labs-task-1-cicd)

## 2. Architecture

```text
Developer
   |
   | git push
   v
GitHub Repository (main)
   |
   v
GitHub Actions Workflow
   |
   v
Run Node.js Tests
   |
   | Tests pass
   v
Build Docker Image
   |
   v
Authenticate with Docker Hub
   |
   v
Push Image: nodejs-demo-app:latest
```

The workflow is defined in `.github/workflows/main.yml`.

## 3. Technologies Used

- **Git and GitHub:** Source control and repository hosting.
- **GitHub Actions:** CI/CD automation.
- **Node.js 22:** Application runtime.
- **Node.js Test Runner:** Automated testing.
- **Docker:** Application containerization.
- **Docker Hub:** Container image registry.
- **AWS EC2 Ubuntu:** Development and local validation environment.

## 4. Project Structure

```text
Task-1/
├── .github/
│   └── workflows/
│       └── main.yml
├── test/
│   └── app.test.js
├── app.js
├── package.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

## 5. Application Endpoints

| Endpoint      | Expected result                 |
| ------------- | ------------------------------- |
| `/`           | HTTP 200 with a welcome message |
| `/health`     | HTTP 200 with `{"status":"ok"}` |
| Unknown route | HTTP 404                        |

## 6. Run Locally

Prerequisites: Node.js 22 or compatible, npm, Git, and Docker.

Clone the repository:

```bash
git clone https://github.com/shubhkarma666/elevate-labs-task-1-cicd.git
cd elevate-labs-task-1-cicd
```

Run automated tests:

```bash
npm test
```

Start the application:

```bash
npm start
```

In another terminal, test the endpoints:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl -i http://localhost:3000/unknown
```

## 7. Docker Usage

Build the image:

```bash
docker build -t nodejs-demo-app:local .
```

Run the container:

```bash
docker run --rm -p 3000:3000 nodejs-demo-app:local
```

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

The Dockerfile runs the application as a non-root user.

## 8. GitHub Actions Configuration

The workflow is stored at `.github/workflows/main.yml`.

It contains two jobs:

1. **test:** Checks out the source code, installs the Node.js runtime, and runs `npm test`.
2. **build-and-push:** Runs after the test job succeeds on pushes to `main`. It builds the Docker image and publishes it to Docker Hub.

Docker Hub credentials are stored in GitHub Actions repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Never commit access tokens, passwords, private keys, or `.env` files.

## 9. Validation Results

Record the actual results from your environment before submission.

- [ ] Node.js and npm versions verified.
- [ ] Automated tests pass.
- [ ] Local Docker image builds successfully.
- [ ] Application endpoints return expected responses.
- [ ] GitHub Actions test job succeeds.
- [ ] GitHub Actions Docker publishing job succeeds.
- [ ] Docker Hub image can be pulled successfully.

## 10. Troubleshooting

### GitHub authentication fails

For Git over HTTPS, use a supported token instead of your GitHub account password. Alternatively, configure SSH authentication and verify the repository remote URL.

### GitHub rejects a workflow file

Check your authentication method and repository permissions. Fine-grained tokens use repository permissions, while classic tokens may require the `workflow` scope to push workflow files.

### GitHub Actions cannot log in to Docker Hub

Verify that `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` exist under the repository's Actions secrets. Check that the token has the required Docker Hub permissions.

Never print secrets in workflow logs.

### Docker build fails

Check that the Docker daemon is running, the Dockerfile exists, and the build context is correct.

```bash
sudo systemctl status docker
sudo docker build -t nodejs-demo-app:local .
```

### Tests fail in GitHub Actions

Run the same tests locally:

```bash
npm test
```

Review the failing test output and compare the runtime version and application files with those used by the workflow.

### Git push is rejected

Check the configured remote and working tree:

```bash
git remote -v
git status
git log -1 --oneline
```

Resolve authentication or branch-history issues before retrying the push.

## 11. Interview Questions and Answers

### Q1. What is CI/CD?

**Continuous Integration (CI)** automatically builds and tests code changes. **Continuous Delivery or Deployment (CD)** automates preparing or releasing validated software. This project tests the application and publishes its Docker image automatically.

### Q2. How do GitHub Actions work?

GitHub Actions runs workflows defined in YAML files under `.github/workflows/`. Events such as pushes trigger jobs, which execute steps on runners.

### Q3. What are runners?

Runners are machines that execute workflow jobs. GitHub-hosted runners provide managed environments, such as Ubuntu. Self-hosted runners are managed by the user or organization.

### Q4. What is the difference between jobs and steps?

A **job** is a group of steps executed on a runner. A **step** is an individual action or shell command within a job. Jobs can run in parallel or use `needs` to define dependencies.

### Q5. How do you secure secrets in GitHub Actions?

Store credentials in GitHub Actions secrets rather than source code. Give tokens minimum permissions, rotate them when necessary, avoid printing them in logs, and never expose secrets to untrusted pull-request code.

### Q6. How do you handle deployment errors?

Inspect the failed job and logs, identify the root cause, fix the issue, and rerun the workflow. Use health checks, timeouts, clear failure handling, and rollback strategies for real deployments.

### Q7. Explain the Docker build-and-push workflow.

The pipeline checks out the code, configures Docker Buildx, authenticates to Docker Hub using a secret token, builds an image from the Dockerfile, and pushes the tagged image to the registry.

### Q8. How can you test a CI/CD pipeline locally?

Run application tests locally with `npm test`, build the container with `docker build`, run it with `docker run`, and validate endpoints with `curl`. These checks validate application behavior but do not fully reproduce GitHub Actions.

### Q9. What is the role of Docker in CI/CD?

Docker packages an application and its runtime into an image. This makes it easier to distribute and run the application consistently across supported environments.

## 12. Security and Production Readiness

- [ ] Secrets are stored outside source code.
- [ ] Docker container runs as a non-root user.
- [ ] GitHub Actions permissions are restricted.
- [ ] Dependencies and base images are reviewed and updated.
- [ ] Docker image tags and releases are traceable.
- [ ] Logs and health checks are available.
- [ ] Production deployment and rollback procedures are defined before real release use.

## 13. Learning Outcomes

Through this project, I practiced source control with Git, automated testing, GitHub Actions workflows, Docker image building, registry authentication, and CI/CD troubleshooting.

**Scope note:** This pipeline publishes a Docker image to Docker Hub. It does not automatically deploy the application to a running production server.

## 14. Evidence

Add screenshots of the successful GitHub Actions run and the published Docker Hub image before submitting the project.

