# AWS ECS Deployment Notes

This repository now includes:

- `backend-task-definition.template.json`
- `frontend-task-definition.template.json`
- a GitHub Actions deployment workflow that builds images, pushes them to Amazon ECR, and updates Amazon ECS services

## Create These AWS Resources Once

1. Two Amazon ECR repositories:
   - `puppet-backend`
   - `puppet-frontend`
2. One Amazon ECS cluster.
3. Two ECS services on Fargate:
   - one for the backend task definition
   - one for the frontend task definition
4. One ECS task execution role with `AmazonECSTaskExecutionRolePolicy`.
5. Application Load Balancer routing:
   - `/api/*`, `/auth/*`, `/uploads/*` -> backend target group
   - `/*` -> frontend target group
6. AWS Secrets Manager or SSM Parameter Store entries for backend secrets.
7. An IAM role that GitHub Actions can assume with OIDC.

## GitHub Repository Variables

Add these repository variables before enabling deployments:

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `ECS_CLUSTER`
- `ECS_EXECUTION_ROLE_ARN`
- `ECS_BACKEND_SERVICE`
- `ECS_FRONTEND_SERVICE`
- `ECR_BACKEND_REPOSITORY`
- `ECR_FRONTEND_REPOSITORY`
- `BACKEND_FRONTEND_URL`
- `BACKEND_CORS_ORIGINS` (optional, defaults to `BACKEND_FRONTEND_URL`)
- `BACKEND_GOOGLE_CALLBACK_URL`
- `BACKEND_MONGO_URI_ARN`
- `BACKEND_JWT_SECRET_ARN`
- `BACKEND_GOOGLE_CLIENT_ID_ARN`
- `BACKEND_GOOGLE_CLIENT_SECRET_ARN`

## OIDC Trust Policy Shape

Use GitHub OIDC with a trust policy limited to your repository and `main` branch. GitHub’s official docs recommend checking both:

- `token.actions.githubusercontent.com:aud`
- `token.actions.githubusercontent.com:sub`

Example `sub` for this workflow pattern:

- `repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main`

## Important Production Note

The backend currently stores uploaded asset files on the container filesystem under `uploads/`. That works for a single task, but it is not durable across task replacements and does not scale cleanly beyond one backend task behind a load balancer. For production, move uploads to Amazon S3 or mount shared storage before scaling the backend service horizontally.
