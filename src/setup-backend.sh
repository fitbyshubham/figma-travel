#!/bin/bash

# Narfe Backend Setup Script
# This script helps you deploy the complete backend to Supabase

set -e  # Exit on error

echo "🚀 Narfe Backend Setup"
echo "======================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI is installed${NC}"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Supabase${NC}"
    echo ""
    echo "Logging in..."
    supabase login
fi

echo -e "${GREEN}✅ Logged in to Supabase${NC}"
echo ""

# Get project ID
echo -e "${BLUE}📋 Enter your Supabase Project ID:${NC}"
echo "   (Found in: Project Settings → General → Reference ID)"
read -p "Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID is required${NC}"
    exit 1
fi

# Link to project
echo ""
echo -e "${BLUE}🔗 Linking to Supabase project...${NC}"
supabase link --project-ref "$PROJECT_ID"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully linked to project${NC}"
else
    echo -e "${RED}❌ Failed to link to project${NC}"
    exit 1
fi

# Run migrations
echo ""
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
echo "   This will create all tables, functions, and policies"
echo ""

supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

# Verify migrations
echo ""
echo -e "${BLUE}🔍 Verifying database schema...${NC}"
supabase db diff

# Set up secrets
echo ""
echo -e "${YELLOW}🔐 Setting up Edge Function secrets${NC}"
echo ""
echo "You'll need the following API keys:"
echo "  1. Stripe Secret Key (from https://dashboard.stripe.com/test/apikeys)"
echo "  2. Stripe Webhook Secret (from https://dashboard.stripe.com/test/webhooks)"
echo "  3. OpenAI API Key (from https://platform.openai.com/api-keys)"
echo ""

read -p "Do you have these keys ready? (y/n): " KEYS_READY

if [ "$KEYS_READY" != "y" ]; then
    echo ""
    echo -e "${YELLOW}⏸️  Please get your API keys and run this script again${NC}"
    echo ""
    echo "Or set secrets manually later with:"
    echo "  supabase secrets set STRIPE_SECRET_KEY=sk_xxx"
    echo "  supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx"
    echo "  supabase secrets set OPENAI_API_KEY=sk-xxx"
    echo ""
else
    echo ""
    read -p "Stripe Secret Key: " STRIPE_KEY
    read -p "Stripe Webhook Secret: " STRIPE_WEBHOOK
    read -p "OpenAI API Key: " OPENAI_KEY
    
    echo ""
    echo "Setting secrets..."
    supabase secrets set STRIPE_SECRET_KEY="$STRIPE_KEY"
    supabase secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK"
    supabase secrets set OPENAI_API_KEY="$OPENAI_KEY"
    
    echo -e "${GREEN}✅ Secrets configured${NC}"
fi

# Deploy Edge Functions
echo ""
echo -e "${BLUE}⚡ Deploying Edge Functions...${NC}"
echo ""

FUNCTIONS=("createPurchase" "stripeWebhook" "createItinerary" "generateEmbedding" "getFeed" "uploadSignedUrl")

for func in "${FUNCTIONS[@]}"; do
    echo "Deploying $func..."
    supabase functions deploy "$func" --no-verify-jwt
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $func deployed${NC}"
    else
        echo -e "${RED}❌ Failed to deploy $func${NC}"
    fi
    echo ""
done

# List deployed functions
echo ""
echo -e "${BLUE}📋 Deployed functions:${NC}"
supabase functions list

# Get project URL
echo ""
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Configure Stripe Webhook:"
echo "   URL: https://$PROJECT_ID.supabase.co/functions/v1/stripeWebhook"
echo "   Events: payment_intent.succeeded, payment_intent.payment_failed,"
echo "           charge.refunded, account.updated, transfer.created"
echo ""
echo "2. Get your Supabase credentials from:"
echo "   Project Settings → API"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo ""
echo "3. Update your frontend .env.local:"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_ID.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]"
echo ""
echo "4. Test the API:"
echo "   curl https://$PROJECT_ID.supabase.co/functions/v1/getFeed?page=1&limit=10"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Your Narfe backend is ready!${NC}"
echo ""
