/**
 * Load Test Script for Narfe API
 * Uses k6 (https://k6.io/) for load testing
 * 
 * Run with: k6 run load-test.ts
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const feedLatency = new Trend('feed_latency');
const searchLatency = new Trend('search_latency');

// Load test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 200 },  // Ramp up to 200 users
    { duration: '3m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Error rate under 5%
    errors: ['rate<0.1'],              // Custom error rate under 10%
  },
};

// Configuration
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || '';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
};

export default function () {
  // Test scenarios with weighted distribution

  // Scenario 1: Browse feed (50% of traffic)
  if (Math.random() < 0.5) {
    const feedResponse = http.get(
      `${SUPABASE_URL}/functions/v1/getFeed?page=1&limit=20&type=trending`,
      { headers }
    );

    const feedSuccess = check(feedResponse, {
      'feed status is 200': (r) => r.status === 200,
      'feed has itineraries': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.itineraries);
        } catch {
          return false;
        }
      },
    });

    feedLatency.add(feedResponse.timings.duration);
    errorRate.add(!feedSuccess);
  }

  // Scenario 2: Search itineraries (25% of traffic)
  else if (Math.random() < 0.75) {
    const searchQueries = ['Bali', 'Paris', 'Tokyo', 'New York', 'Barcelona'];
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    const searchResponse = http.post(
      `${SUPABASE_URL}/rest/v1/rpc/search_itineraries`,
      JSON.stringify({
        p_query: query,
        p_limit: 20,
        p_offset: 0,
      }),
      { headers }
    );

    const searchSuccess = check(searchResponse, {
      'search status is 200': (r) => r.status === 200,
      'search returns array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch {
          return false;
        }
      },
    });

    searchLatency.add(searchResponse.timings.duration);
    errorRate.add(!searchSuccess);
  }

  // Scenario 3: View itinerary details (15% of traffic)
  else if (Math.random() < 0.9) {
    const listResponse = http.get(
      `${SUPABASE_URL}/rest/v1/itineraries?status=eq.published&limit=1`,
      { headers }
    );

    if (listResponse.status === 200) {
      try {
        const itineraries = JSON.parse(listResponse.body);
        if (itineraries.length > 0) {
          const itineraryId = itineraries[0].id;

          const detailResponse = http.get(
            `${SUPABASE_URL}/rest/v1/itineraries?id=eq.${itineraryId}&select=*,itinerary_stops(*)`,
            { headers }
          );

          check(detailResponse, {
            'itinerary detail status is 200': (r) => r.status === 200,
            'itinerary has stops': (r) => {
              try {
                const body = JSON.parse(r.body);
                return body.length > 0;
              } catch {
                return false;
              }
            },
          });
        }
      } catch (e) {
        errorRate.add(1);
      }
    }
  }

  // Scenario 4: View profile (10% of traffic)
  else {
    const profileResponse = http.get(
      `${SUPABASE_URL}/rest/v1/profiles?limit=1`,
      { headers }
    );

    check(profileResponse, {
      'profile status is 200': (r) => r.status === 200,
    });
  }

  // Simulate user think time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Setup function (runs once per VU before scenarios)
export function setup() {
  console.log('🚀 Starting load test...');
  console.log(`Target: ${SUPABASE_URL}`);
  return { timestamp: new Date().toISOString() };
}

// Teardown function (runs once after all scenarios)
export function teardown(data) {
  console.log('✅ Load test completed!');
  console.log(`Started at: ${data.timestamp}`);
  console.log(`Finished at: ${new Date().toISOString()}`);
}
