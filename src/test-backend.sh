#!/bin/bash

# Narfe Backend Test Script
# Quick verification that your backend is working

set -e

echo "🧪 Narfe Backend Test Suite"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get project URL
echo -e "${BLUE}📋 Enter your Supabase Project URL:${NC}"
echo "   (Example: https://xxxxx.supabase.co)"
read -p "URL: " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ Supabase URL is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Enter your Supabase Anon Key:${NC}"
read -p "Anon Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Anon Key is required${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health check
echo -e "${BLUE}Test 1: API Health Check${NC}"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/")

if [ "$HEALTH_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ API is responding${NC}"
else
    echo -e "${RED}❌ API not responding (HTTP $HEALTH_RESPONSE)${NC}"
fi
echo ""

# Test 2: Database tables
echo -e "${BLUE}Test 2: Database Tables${NC}"
TABLES_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/profiles?limit=0" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -w "%{http_code}")

if [[ $TABLES_RESPONSE == *"200"* ]]; then
    echo -e "${GREEN}✅ Profiles table exists${NC}"
else
    echo -e "${RED}❌ Profiles table not found${NC}"
fi
echo ""

# Test 3: Edge Functions
echo -e "${BLUE}Test 3: Edge Functions${NC}"

echo "Testing getFeed function..."
FEED_RESPONSE=$(curl -s "$SUPABASE_URL/functions/v1/getFeed?page=1&limit=10" \
  -H "apikey: $SUPABASE_ANON_KEY")

if [[ $FEED_RESPONSE == *"itineraries"* ]]; then
    echo -e "${GREEN}✅ getFeed function working${NC}"
else
    echo -e "${YELLOW}⚠️  getFeed returned: $FEED_RESPONSE${NC}"
fi
echo ""

# Test 4: RLS Policies
echo -e "${BLUE}Test 4: Row Level Security${NC}"
echo "Attempting to access profiles without auth..."
PROFILES_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/profiles" \
  -H "apikey: $SUPABASE_ANON_KEY")

if [[ $PROFILES_RESPONSE == *"["* ]]; then
    echo -e "${GREEN}✅ RLS allowing public profile reads${NC}"
else
    echo -e "${YELLOW}⚠️  RLS response: $PROFILES_RESPONSE${NC}"
fi
echo ""

# Test 5: Storage bucket
echo -e "${BLUE}Test 5: Storage Buckets${NC}"
echo "Checking for media bucket..."
# This would need auth, so we'll skip for now
echo -e "${YELLOW}⏭️  Skipped (requires authentication)${NC}"
echo ""

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Basic tests completed!${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Run integration tests:"
echo "   export SUPABASE_URL=$SUPABASE_URL"
echo "   export SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo "   deno test --allow-net --allow-env tests/integration/api.test.ts"
echo ""
echo "2. Test in browser:"
echo "   Open: $SUPABASE_URL/functions/v1/getFeed?page=1&limit=10"
echo ""
echo "3. Check Supabase Dashboard:"
echo "   Database → Tables (should see 12 tables)"
echo "   Edge Functions → Functions (should see 6 functions)"
echo "   Storage → Buckets (create 'media' bucket if needed)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
