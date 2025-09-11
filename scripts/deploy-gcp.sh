#!/bin/bash

# GCP + Firebase deployment script for dev.aprio.one
# This script deploys the Aprio Living Twin platform using Google Cloud Platform

set -e

echo "🚀 Deploying Aprio Living Twin to GCP + Firebase..."

# Check if required tools are installed
command -v gcloud >/dev/null 2>&1 || { echo "❌ gcloud CLI is required but not installed. Please install Google Cloud SDK." >&2; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo "❌ firebase CLI is required but not installed. Run: npm install -g firebase-tools" >&2; exit 1; }

# Check if required environment variables are set
if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "❌ Error: ELEVENLABS_API_KEY environment variable is not set"
    echo "Please set your ElevenLabs API key:"
    echo "export ELEVENLABS_API_KEY=your-key-here"
    exit 1
fi

# Authenticate with GCP and Firebase (if needed)
echo "🔐 Checking authentication..."
gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 | grep -q "@" || {
    echo "Please authenticate with Google Cloud:"
    gcloud auth login
}

firebase projects:list >/dev/null 2>&1 || {
    echo "Please authenticate with Firebase:"
    firebase login
}

# Set the GCP project (update this to your actual project ID)
PROJECT_ID="aprio-living-twin"  # Update this to your actual project ID
echo "📋 Using GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build and deploy API to Cloud Run
echo "🏗️ Building and deploying API to Cloud Run..."
gcloud run deploy aprio-living-twin-api \
  --source . \
  --dockerfile docker/Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="DOMAIN=aprio.one,API_URL=https://dev.aprio.one/api,ENABLE_AI_PROCESSING=true,LOG_LEVEL=INFO,ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY" \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --min-instances 1 \
  --timeout 300

# Get the Cloud Run service URL
API_URL=$(gcloud run services describe aprio-living-twin-api \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)')

echo "✅ API deployed to Cloud Run: $API_URL"

# Update firebase.json with the correct Cloud Run URL
echo "📝 Updating Firebase configuration..."
sed -i.bak "s|https://dev.aprio.one/api|$API_URL|g" firebase.json

# Build Next.js application for static export
echo "🏗️ Building Next.js application..."
cd web
npm install
npm run export
cd ..

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Restore firebase.json
mv firebase.json.bak firebase.json

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now available at:"
echo "   Web App:      https://dev.aprio.one"
echo "   API:          https://dev.aprio.one/api"
echo "   Health Check: https://dev.aprio.one/api/healthz" 
echo "   API Docs:     https://dev.aprio.one/api/docs"
echo "   Cloud Run:    $API_URL"
echo ""
echo "📊 To monitor Cloud Run logs:"
echo "   gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=aprio-living-twin-api\" --limit=50 --format=json"
echo ""
echo "🔄 To redeploy:"
echo "   ./scripts/deploy-gcp.sh"