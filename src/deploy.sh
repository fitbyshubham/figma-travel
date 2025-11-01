#!/bin/bash

# Narfe Backend Deployment Script
# This script deploys all edge functions and checks configuration

set -e

echo "🚀 Narfe Backend Deployment"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Project not linked to Supabase${NC}"
    echo "Please run: supabase link --project-ref your-project-ref"
    exit 1
fi

echo -e "${GREEN}✅ Project linked${NC}"
echo ""

# Function to deploy an edge function
deploy_function() {
    local func_name=$1
    echo "📦 Deploying function: $func_name"
    
    if supabase functions deploy $func_name --no-verify-jwt 2>&1 | grep -q "Error"; then
        echo -e "${RED}❌ Failed to deploy $func_name${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Successfully deployed $func_name${NC}"
    fi
}

# Deploy all edge functions
echo "📦 Deploying Edge Functions..."
echo ""

FUNCTIONS=(
    "server"
    "createItinerary"
    "createPurchase"
    "generateEmbedding"
    "getFeed"
    "stripeWebhook"
    "uploadSignedUrl"
)

FAILED_FUNCTIONS=()

for func in "${FUNCTIONS[@]}"; do
    if ! deploy_function "$func"; then
        FAILED_FUNCTIONS+=("$func")
    fi
    echo ""
done

# Summary
echo "=============================="
echo "📊 Deployment Summary"
echo "=============================="

TOTAL=${#FUNCTIONS[@]}
FAILED=${#FAILED_FUNCTIONS[@]}
SUCCESS=$((TOTAL - FAILED))

echo "Total functions: $TOTAL"
echo -e "${GREEN}Successful: $SUCCESS${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
    echo ""
    echo "Failed functions:"
    for func in "${FAILED_FUNCTIONS[@]}"; do
        echo -e "${RED}  - $func${NC}"
    done
    exit 1
else
    echo -e "${GREEN}All functions deployed successfully! 🎉${NC}"
fi

echo ""
echo "=============================="
echo "🔑 Environment Variables Check"
echo "=============================="

# Check which secrets are set
echo "Checking required secrets..."
echo ""

REQUIRED_SECRETS=(
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "BOOKING_COM_API_KEY"
    "OPENAI_API_KEY"
)

echo "To set a secret, run:"
echo "  supabase secrets set SECRET_NAME=secret_value"
echo ""

# Note: We can't actually check if secrets are set via CLI
# This is just a reminder
echo "Required secrets:"
for secret in "${REQUIRED_SECRETS[@]}"; do
    echo -e "${YELLOW}  ⚠️  $secret${NC}"
done

echo ""
echo "=============================="
echo "📝 Next Steps"
echo "=============================="
echo ""
echo "1. Set all required environment variables (see above)"
echo "2. Test the deployment:"
echo "   curl https://<project-ref>.supabase.co/functions/v1/make-server-183d2340/health"
echo ""
echo "3. Run database migrations if not done yet:"
echo "   supabase db push"
echo ""
echo "4. Review the full deployment checklist:"
echo "   cat BACKEND-DEPLOYMENT-READY.md"
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
