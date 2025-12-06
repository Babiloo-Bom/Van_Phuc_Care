// Vaccine schedule seed script for Van Phuc Care
// Run: node scripts/vaccine-seed.js

const fetch = require('node-fetch');

const BASE_URL = process.env.SEED_API_URL || 'http://103.216.119.104:3000';

async function seed() {
  try {
    const res = await fetch(`${BASE_URL}/api/u/schedule-vaccins/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Seed failed');
    console.log(data?.message || 'Seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
}

seed();
