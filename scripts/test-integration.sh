#!/bin/bash

# Sample script to trigger integration tests after building and pushing an image
# This demonstrates the complete workflow for development testing

set -e

echo "🚀 Building and testing Docker image with GitHub Packages integration..."

# Configuration
REGISTRY="ghcr.io"
REPO_OWNER="$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\).*/\1/' | tr '[:upper:]' '[:lower:]')"
REPO_NAME="$(basename -s .git $(git config --get remote.origin.url) | tr '[:upper:]' '[:lower:]')"
IMAGE_NAME="$REGISTRY/$REPO_OWNER/$REPO_NAME"
TAG="test-$(date +%s)"

echo "📦 Image details:"
echo "  Registry: $REGISTRY"
echo "  Repository: $REPO_OWNER/$REPO_NAME"
echo "  Full image: $IMAGE_NAME:$TAG"

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t "$IMAGE_NAME:$TAG" .

# Tag as latest for local testing
docker tag "$IMAGE_NAME:$TAG" "$IMAGE_NAME:latest"

echo "✅ Docker image built successfully!"
echo "🏷️  Tagged as: $IMAGE_NAME:$TAG"
echo "🏷️  Tagged as: $IMAGE_NAME:latest"

echo ""
echo "🧪 To run integration tests:"
echo "1. Push the image to GitHub Packages:"
echo "   docker push $IMAGE_NAME:$TAG"
echo ""
echo "2. Go to your GitHub repository > Actions"
echo "3. Select 'Integration Test Development' workflow"
echo "4. Click 'Run workflow'"
echo "5. Enter image tag: $TAG"
echo ""
echo "📋 Or use the GitHub CLI:"
echo "   gh workflow run integration-test-dev.yml -f image-tag=$TAG"
echo ""
echo "🔍 The integration tests will:"
echo "  ✓ Start MongoDB service container"
echo "  ✓ Start your blog service container"
echo "  ✓ Run comprehensive API tests"
echo "  ✓ Generate test reports as artifacts"
echo "  ✓ Display results in GitHub Actions UI"
