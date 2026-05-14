#!/bin/bash
set -e

GCP_PROJECT="project-7b397695-5327-4467-8e0"
GCP_REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/$GCP_PROJECT/financial-partner/api:latest"
SERVICE="financial-partner-api"

echo "▶ Building image for linux/amd64..."
docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE" \
  --push \
  .

echo "▶ Deploying to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$GCP_REGION" \
  --quiet

URL=$(gcloud run services describe "$SERVICE" \
  --region "$GCP_REGION" \
  --format "value(status.url)")

echo ""
echo "✓ Deploy complete: $URL"
