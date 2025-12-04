// User Vaccination Records seed script for Van Phuc Care
// This script creates sample vaccination records for a specific healthbook
// Run: node scripts/user-vaccine-seed.js
//
// Prerequisites:
// 1. Run vaccine-seed.js first to create master vaccine list
// 2. Have at least one healthbook created in the database
//
// Usage:
//   HEALTH_BOOK_ID=xxx CUSTOMER_ID=yyy node scripts/user-vaccine-seed.js

const fetch = require('node-fetch');

const BASE_URL = process.env.SEED_API_URL || 'http://localhost:3000';

// You can set these via environment variables or hardcode for testing
const HEALTH_BOOK_ID = '692480e82e2103386f6d5759';
const CUSTOMER_ID = process.env.CUSTOMER_ID || '';

async function seed() {
  console.log('=== User Vaccination Records Seed ===\n');

  if (!HEALTH_BOOK_ID && !CUSTOMER_ID) {
    console.error('Error: HEALTH_BOOK_ID and CUSTOMER_ID are required!');
    console.log('\nUsage:');
    console.log('  HEALTH_BOOK_ID=xxx CUSTOMER_ID=yyy node scripts/user-vaccine-seed.js');
    console.log('\nExample:');
    console.log('  HEALTH_BOOK_ID=6789abc CUSTOMER_ID=12345def node scripts/user-vaccine-seed.js');
    process.exit(1);
  }

  console.log(`Health Book ID: ${HEALTH_BOOK_ID}`);
  console.log(`Customer ID: ${CUSTOMER_ID}\n`);

  try {
    console.log('Calling seed API...\n');
    
    const res = await fetch(`${BASE_URL}/api/u/vaccination-records/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        healthBookId: HEALTH_BOOK_ID,
        // customerId is optional - API will get it from healthBook
        ...(CUSTOMER_ID && { customerId: CUSTOMER_ID }),
      }),
    });

    const data = await res.json();
    
    // Log full response for debugging
    console.log('Response status:', res.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Seed failed');
    }

    console.log('=== Success ===');
    console.log(`Message: ${data?.data?.message || data?.message}`);
    console.log(`Total vaccines: ${data?.data?.totalVaccines}`);
    console.log(`Records created: ${data?.data?.recordsCreated}`);
    
    if (data?.data?.breakdown) {
      console.log('\nBreakdown:');
      console.log(`  ✓ Completed: ${data.data.breakdown.completed}`);
      console.log(`  ○ Scheduled: ${data.data.breakdown.scheduled}`);
      console.log(`  ◌ Pending: ${data.data.breakdown.pending}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
}

seed();
