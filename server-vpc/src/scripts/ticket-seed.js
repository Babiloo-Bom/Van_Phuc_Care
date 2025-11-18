/**
 * Script to call seed tickets API
 * Run with: node scripts/ticket-seed.js
 */

const fetch = require('node-fetch');

async function seedTickets() {
  try {
    console.log('🎫 Calling seed tickets API...');
    
    const response = await fetch('http://localhost:3000/api/a/seed/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result.message);
      
      if (result.data && result.data.count) {
        console.log(`📋 Tickets seeded: ${result.data.count}`);
        
        if (result.data.tickets && result.data.tickets.length > 0) {
          console.log('\n📋 Sample tickets:');
          result.data.tickets.slice(0, 5).forEach((ticket, index) => {
            console.log(`${index + 1}. [${ticket.ticketNumber}] ${ticket.title}`);
            console.log(`   Category: ${ticket.category} | Priority: ${ticket.priority} | Status: ${ticket.status}`);
          });
          
          if (result.data.tickets.length > 5) {
            console.log(`   ... and ${result.data.tickets.length - 5} more tickets`);
          }
        }
      } else {
        console.log('📋 Response:', JSON.stringify(result, null, 2));
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
      console.log('Status:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the API server is running on http://localhost:3000');
  }
}

seedTickets();
