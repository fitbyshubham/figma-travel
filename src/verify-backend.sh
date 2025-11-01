#!/bin/bash

# Narfe Backend Verification Script
# Checks if all backend components are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Narfe Backend Verification & Health Check      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description - File not found: $file"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    local dir=$1
    local description=$2
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description - Directory not found: $dir"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to warn about something
warn() {
    local message=$1
    echo -e "${YELLOW}⚠️${NC}  $message"
    WARNINGS=$((WARNINGS + 1))
}

echo "📁 Checking File Structure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Edge Functions
check_file "supabase/functions/server/index.tsx" "Main Hono server"
check_file "supabase/functions/server/kv_store.tsx" "KV Store utility"
check_file "supabase/functions/createItinerary/index.ts" "Create Itinerary function"
check_file "supabase/functions/createPurchase/index.ts" "Create Purchase function"
check_file "supabase/functions/generateEmbedding/index.ts" "Generate Embedding function"
check_file "supabase/functions/getFeed/index.ts" "Get Feed function"
check_file "supabase/functions/stripeWebhook/index.ts" "Stripe Webhook function"
check_file "supabase/functions/uploadSignedUrl/index.ts" "Upload Signed URL function"

echo ""
echo "🗄️  Checking Database Migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_dir "supabase/migrations" "Migrations directory"
check_file "supabase/migrations/001_enable_extensions.sql" "Migration 001: Extensions"
check_file "supabase/migrations/002_create_core_tables.sql" "Migration 002: Core tables"
check_file "supabase/migrations/003_create_social_tables.sql" "Migration 003: Social tables"
check_file "supabase/migrations/004_create_functions_triggers.sql" "Migration 004: Functions & triggers"
check_file "supabase/migrations/005_create_rls_policies.sql" "Migration 005: RLS policies"
check_file "supabase/migrations/006_seed_data.sql" "Migration 006: Seed data"
check_file "supabase/migrations/007_add_stop_enhancements.sql" "Migration 007: Stop enhancements"

echo ""
echo "⚙️  Checking Configuration Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "supabase/config.toml" "Supabase configuration"
check_file "utils/supabase/info.tsx" "Supabase connection info"

echo ""
echo "📝 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "BACKEND-DEPLOYMENT-READY.md" "Deployment readiness guide"

echo ""
echo "🔍 Analyzing Code Quality..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for CORS in server
if grep -q "cors(" supabase/functions/server/index.tsx; then
    echo -e "${GREEN}✅${NC} Server has CORS enabled"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} Server missing CORS configuration"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check for error logging in server
if grep -q "logger(" supabase/functions/server/index.tsx; then
    echo -e "${GREEN}✅${NC} Server has error logging"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} Server missing error logging"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check for proper route prefix
if grep -q "/make-server-183d2340/" supabase/functions/server/index.tsx; then
    echo -e "${GREEN}✅${NC} Server routes properly prefixed"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} Server routes missing prefix"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check createItinerary has auth
if grep -q "getUser()" supabase/functions/createItinerary/index.ts; then
    echo -e "${GREEN}✅${NC} createItinerary has authentication"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} createItinerary missing authentication"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check createPurchase has Stripe
if grep -q "Stripe" supabase/functions/createPurchase/index.ts; then
    echo -e "${GREEN}✅${NC} createPurchase has Stripe integration"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} createPurchase missing Stripe integration"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check for platform fee calculation
if grep -q "platformFee" supabase/functions/createPurchase/index.ts; then
    echo -e "${GREEN}✅${NC} Platform fee (10%) configured"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} Platform fee not configured"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check generateEmbedding has OpenAI
if grep -q "openai" supabase/functions/generateEmbedding/index.ts; then
    echo -e "${GREEN}✅${NC} generateEmbedding has OpenAI integration"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} generateEmbedding missing OpenAI integration"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check stripeWebhook has webhook verification
if grep -q "constructEventAsync" supabase/functions/stripeWebhook/index.ts; then
    echo -e "${GREEN}✅${NC} Stripe webhook has signature verification"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} Stripe webhook missing signature verification"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "🗃️  Checking Database Schema..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for required tables in migrations
REQUIRED_TABLES=(
    "profiles"
    "itineraries"
    "itinerary_stops"
    "purchases"
    "likes"
    "saves"
    "follows"
    "comments"
    "activities"
    "media"
    "itinerary_embeddings"
)

for table in "${REQUIRED_TABLES[@]}"; do
    if grep -q "CREATE TABLE $table" supabase/migrations/*.sql; then
        echo -e "${GREEN}✅${NC} Table '$table' defined"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌${NC} Table '$table' not found in migrations"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
done

# Check for pgvector extension
if grep -q "vector" supabase/migrations/001_enable_extensions.sql; then
    echo -e "${GREEN}✅${NC} pgvector extension enabled"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    warn "pgvector extension may not be enabled"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "🔐 Checking Security..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for RLS policies
if grep -q "ENABLE ROW LEVEL SECURITY" supabase/migrations/005_create_rls_policies.sql; then
    echo -e "${GREEN}✅${NC} Row Level Security policies defined"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌${NC} RLS policies not found"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Check that SERVICE_ROLE_KEY is not in frontend code
if grep -r "SUPABASE_SERVICE_ROLE_KEY" App.tsx components/ 2>/dev/null; then
    echo -e "${RED}❌${NC} SERVICE_ROLE_KEY found in frontend code (SECURITY RISK)"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
else
    echo -e "${GREEN}✅${NC} No SERVICE_ROLE_KEY in frontend code"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY                        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

PASS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"

if [ $FAILED_CHECKS -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
fi

echo ""
echo "Pass Rate: $PASS_RATE%"
echo ""

if [ $PASS_RATE -eq 100 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ BACKEND IS READY FOR DEPLOYMENT! 🚀          ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: chmod +x deploy.sh"
    echo "  2. Run: ./deploy.sh"
    echo "  3. Set environment variables (see BACKEND-DEPLOYMENT-READY.md)"
    echo ""
    exit 0
elif [ $PASS_RATE -ge 90 ]; then
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  BACKEND IS MOSTLY READY                     ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Review the failed checks above before deploying."
    echo ""
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ BACKEND NOT READY FOR DEPLOYMENT              ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Please fix the failed checks above."
    echo ""
    exit 1
fi
