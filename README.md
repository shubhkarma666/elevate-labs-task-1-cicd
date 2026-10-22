# Elevate Labs Task 1: CI/CD Pipeline with GitHub Actions

## 1. Project Overview

This project implements an automated CI/CD pipeline for a Node.js web application using GitHub Actions, Docker, Docker Hub, and AWS EC2.

Whenever code is pushed to the `main` branch, the pipeline:

1. Runs automated tests.
2. Builds a Docker image.
3. Pushes the image to Docker Hub.
4. Connects to AWS EC2 using SSH.
5. Pulls the latest Docker image.
6. Removes the existing application container, if present.
7. Creates and starts a new container.
8. Verifies that the application is responding.

**GitHub Repository:**  
https://github.com/shubhkarma666/elevate-labs-task-1-cicd

## 2. Architecture

```text
Developer
   |
   | git push to main
   v
GitHub Repository
   |
   v
GitHub Actions Workflow
   |
   v
Run Automated Tests
   |
   | Tests pass
   v
Build Docker Image
   |
   v
Push Image to Docker Hub
   |
   v
Connect to AWS EC2 via SSH
   |
   v
Pull Latest Docker Image
   |
   v
Remove Existing Container
   |
   v
Create and Start New Container
   |
   v
Validate Application Health
   |
   v
Access Website on Port 3000
```

The workflow is defined in `.github/workflows/main.yml`.

## 3. Technologies Used

- **Git and GitHub:** Source control and repository hosting.
- **GitHub Actions:** CI/CD automation.
- **Node.js 22:** Application runtime.
- **Node.js Test Runner:** Automated testing.
- **Docker:** Application containerization.
- **Docker Hub:** Docker image registry.
- **AWS EC2 Ubuntu:** Application hosting server.
- **SSH:** Secure remote access for deployment.

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

| Endpoint | Expected result |
|---|---|
| `/` | HTTP 200 with a welcome message |
| `/health` | HTTP 200 with `{"status":"ok"}` |
| Unknown route | HTTP 404 |

## 6. Run Locally

### Prerequisites

- Node.js 22 or compatible
- npm
- Git
- Docker

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

### Build the Docker image

```bash
docker build -t nodejs-demo-app:local .
```

### Run the container

```bash
docker run -d \
  --name nodejs-demo \
  --restart unless-stopped \
  -p 3000:3000 \
  nodejs-demo-app:local
```

### Verify the container

```bash
docker ps
docker logs nodejs-demo
curl http://localhost:3000/
curl http://localhost:3000/health
```

The Dockerfile runs the Node.js application as a non-root user.

### Stop and remove the container

```bash
docker rm -f nodejs-demo
```

## 8. GitHub Actions CI/CD Pipeline

The workflow is stored in `.github/workflows/main.yml`.

The pipeline contains three stages:

### Stage 1: Test

- Checks out the source code.
- Sets up Node.js 22.
- Runs `npm test`.
- Stops the pipeline if tests fail.

### Stage 2: Build and Push

- Runs only after successful tests.
- Configures Docker Buildx.
- Authenticates with Docker Hub.
- Builds the Docker image.
- Publishes the image as `nodejs-demo-app:latest`.

### Stage 3: Deploy to AWS EC2

- Connects to the EC2 instance using SSH.
- Pulls the latest image from Docker Hub.
- Removes the existing `nodejs-demo` container if present.
- Starts a new container with the updated image.
- Verifies that the application is responding.

The deployment job should run only after the image has been published successfully.

### GitHub Actions secrets and variables

Configure the required values under:

**GitHub Repository → Settings → Secrets and variables → Actions**

Store sensitive values as secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_SSH_PRIVATE_KEY`

Configure non-secret deployment values as variables where appropriate:

- `EC2_HOST` — EC2 public IP address or DNS name.
- `EC2_USER` — SSH username, such as `ubuntu`.
- `DOCKERHUB_USERNAME` can also be configured as a variable if your workflow uses that configuration consistently.

Use the exact names referenced by your workflow. Never commit passwords, access tokens, SSH private keys, or `.env` files.

## 9. Automated EC2 Deployment

The application is deployed to an AWS EC2 Ubuntu instance through SSH.

### Deployment process

1. GitHub Actions completes automated testing.
2. The Docker image is built and pushed to Docker Hub.
3. GitHub Actions connects to EC2 using SSH.
4. EC2 pulls the latest Docker image.
5. The existing container named `nodejs-demo` is removed if present.
6. A new container is created and started.
7. The deployment checks the application health endpoint.

### Example deployment commands

These commands run on the EC2 instance after connecting through SSH.

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

```bash
docker pull YOUR_DOCKERHUB_USERNAME/nodejs-demo-app:latest

docker rm -f nodejs-demo 2>/dev/null || true

docker run -d \
  --name nodejs-demo \
  --restart unless-stopped \
  -p 3000:3000 \
  YOUR_DOCKERHUB_USERNAME/nodejs-demo-app:latest
```

The removal command allows repeated deployments without a container-name conflict. If the old container does not exist, deployment continues.

**Availability note:** This approach causes brief downtime while the old container is removed and the replacement starts. A failed deployment can leave the application unavailable until repaired.

### Verify the deployed application

On EC2:

```bash
docker ps
docker logs --tail 100 nodejs-demo
curl -f http://localhost:3000/health
```

Expected health response:

```json
{"status":"ok"}
```

### Access the application in your browser

Open:

```text
http://YOUR_EC2_PUBLIC_IP:3000
```

Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IPv4 address.

Ensure the EC2 security group allows inbound TCP port `3000` only from the intended client IP addresses.

## 10. Validation Results

Record the actual results from your environment before submission.

- [ ] Node.js, npm, and Git versions verified.
- [ ] Automated tests pass.
- [ ] Local Docker image builds successfully.
- [ ] Application endpoints return expected responses.
- [ ] GitHub Actions test job succeeds.
- [ ] Docker image is published to Docker Hub.
- [ ] SSH deployment to EC2 succeeds.
- [ ] Existing container is replaced correctly.
- [ ] New container remains running.
- [ ] Application is accessible from the browser.
- [ ] Health endpoint returns HTTP 200.
- [ ] Latest workflow and Docker Hub screenshots are saved.

## 11. Troubleshooting

### GitHub authentication fails

For HTTPS Git operations, use a supported Personal Access Token instead of your GitHub account password. Alternatively, configure SSH authentication and verify the remote URL.

```bash
git remote -v
ssh -T git@github.com
```

### GitHub rejects a workflow file

Check your authentication method and repository permissions. Fine-grained tokens use repository permissions, while classic tokens may require the `workflow` scope to push workflow files.

### GitHub Actions cannot log in to Docker Hub

Verify that the Docker Hub username and access token are configured as GitHub Actions secrets. Confirm the token has the required permissions.

Never print secrets in workflow logs.

### Docker build fails

Check the Docker service, Dockerfile, and build context.

```bash
sudo systemctl status docker
sudo docker build -t nodejs-demo-app:local .
```

### Tests fail in GitHub Actions

Run the tests locally:

```bash
npm test
```

Inspect the failing test and compare the Node.js version and source files with those used by the workflow.

### SSH deployment fails

Check the EC2 public IP, SSH username, SSH private key secret, and network access.

```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Keep the private key secure and never commit it to Git.

### Docker container name already exists

Remove the old container before starting the replacement:

```bash
docker rm -f nodejs-demo
```

The automated deployment should handle this condition.

### Port 3000 is unavailable

Check for an existing container or process:

```bash
sudo docker ps
sudo ss -ltnp | grep ':3000'
```

Resolve the port conflict before starting another container.

### Container starts but the website is inaccessible

Check the container status and logs:

```bash
sudo docker ps -a
sudo docker logs --tail 100 nodejs-demo
curl -i http://localhost:3000/health
```

Also check the EC2 security group and confirm that the container port is mapped to host port `3000`.

### Git push is rejected

Check the remote, branch, and working tree:

```bash
git remote -v
git status
git log -1 --oneline
```

Resolve authentication or branch-history problems before retrying.

## 12. Interview Questions and Answers

### Q1. What is CI/CD?

Continuous Integration automatically tests code changes. Continuous Delivery or Deployment automates preparing or releasing validated software. This project tests code, publishes a Docker image, and deploys it to EC2.

### Q2. How do GitHub Actions work?

GitHub Actions runs YAML workflows stored under `.github/workflows/`. Events such as pushes trigger jobs that execute steps on runners.

### Q3. What are runners?

Runners are machines that execute workflow jobs. GitHub-hosted runners are managed by GitHub, while self-hosted runners are managed by the user or organization.

### Q4. What is the difference between jobs and steps?

A job is a group of steps executed on a runner. A step is an individual action or shell command. Jobs can run in parallel or use `needs` to define dependencies.

### Q5. How do you secure secrets in GitHub Actions?

Store credentials in GitHub Actions secrets, use least-privilege permissions, rotate tokens, and never print or commit credentials. Restrict deployment access to trusted branches.

### Q6. How do you handle deployment errors?

Inspect workflow logs, identify the root cause, correct the configuration or application, and rerun the pipeline. Health checks and rollback procedures help restore service after failed deployments.

### Q7. Explain the Docker build-and-push workflow.

The workflow checks out the code, configures Docker Buildx, authenticates to Docker Hub with a secret token, builds the image, and pushes the tagged image to the registry.

### Q8. How can you test a CI/CD pipeline locally?

Run `npm test`, build the image using `docker build`, run it with `docker run`, and test endpoints using `curl`. These checks validate the application but do not fully reproduce GitHub Actions.

### Q9. What is the role of Docker in CI/CD?

Docker packages the application and its runtime into an image. The same image can be distributed and run consistently across supported environments, including AWS EC2.

## 13. Security and Production Readiness

- [ ] Credentials are stored outside source code.
- [ ] SSH private keys are stored as GitHub Actions secrets.
- [ ] SSH access is restricted to trusted sources.
- [ ] The Docker container runs as a non-root user.
- [ ] GitHub Actions permissions are restricted.
- [ ] The deployment branch is protected.
- [ ] Docker images and dependencies are reviewed and updated.
- [ ] Deployment failures are detected through health checks.
- [ ] Rollback procedures are defined.
- [ ] HTTPS is configured before exposing a real production application.
- [ ] Immutable image tags are considered for traceability.

## 14. Learning Outcomes

Through this project, I practiced:

- Git version control and GitHub repository management.
- Automated testing with Node.js.
- CI/CD workflows using GitHub Actions.
- Docker image creation and registry publishing.
- SSH-based deployment to AWS EC2.
- Automatic container replacement during deployment.
- Application health checks and troubleshooting.
- Secrets management and deployment security.

## 15. Evidence

Include screenshots of:

1. A successful GitHub Actions workflow.
2. The published Docker Hub image.
3. The running Docker container on EC2.
4. The application open in a browser.
5. The successful health check response.

**Project scope:** This project automates testing, Docker image publishing, and container deployment to one EC2 instance. It is a learning deployment, not a highly available production architecture.

