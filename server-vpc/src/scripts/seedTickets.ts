import mongoose from 'mongoose';
import { MongoDbTickets } from '../mongodb/tickets';
import type { ITicket } from '../mongodb/tickets';
import MongoDbCustomers from '../mongodb/customers';
import MongoDbAdmins from '../mongodb/admins';

/**
 * Seed Tickets Data
 * Generate sample ticket data for testing
 * 
 * Usage:
 * npm run seed:tickets
 * or
 * ts-node src/scripts/seedTickets.ts
 */

const TICKET_TEMPLATES = {
  technical: [
    {
      title: 'Cannot login to my account',
      description: 'I have been trying to log in for the past hour but keep getting "Invalid credentials" error. I tried resetting my password twice but the issue persists. Please help me regain access to my account urgently.',
      priority: 'high',
      category: 'technical'
    },
    {
      title: 'Website loading very slowly',
      description: 'The website has been loading extremely slowly for the past few days. Pages take 30+ seconds to load and sometimes timeout completely. This is affecting my productivity. My internet connection is fine with other websites.',
      priority: 'medium',
      category: 'technical'
    },
    {
      title: 'Error when uploading files',
      description: 'Every time I try to upload a document, I get an error message "Upload failed". I have tried different file formats (PDF, DOCX) and sizes but nothing works. Can you please fix this?',
      priority: 'medium',
      category: 'technical'
    },
    {
      title: 'Mobile app keeps crashing',
      description: 'The mobile app crashes immediately after I open it. I have tried reinstalling the app and clearing cache but the problem continues. I am using iPhone 13 with iOS 17.2.',
      priority: 'high',
      category: 'technical'
    },
    {
      title: 'Payment gateway not responding',
      description: 'I am trying to make a payment but the payment gateway shows a loading screen forever and never completes. I need to complete this transaction urgently. Please investigate ASAP.',
      priority: 'urgent',
      category: 'technical'
    },
    {
      title: 'Email notifications not working',
      description: 'I have not been receiving any email notifications for the past week. I have checked my spam folder and email settings, everything looks correct. Please check if there is an issue with the notification system.',
      priority: 'low',
      category: 'technical'
    },
    {
      title: 'Dashboard shows incorrect data',
      description: 'The dashboard is displaying incorrect statistics. The numbers do not match the actual data in my reports. This started happening after the last system update. Can you please investigate?',
      priority: 'medium',
      category: 'technical'
    },
    {
      title: 'Cannot reset password',
      description: 'I clicked on "Forgot Password" but never received the reset email. I have tried multiple times and checked all folders including spam. My registered email is correct in the system.',
      priority: 'high',
      category: 'technical'
    },
    {
      title: 'API integration failing',
      description: 'Our API integration stopped working suddenly. Getting 401 Unauthorized errors even though the API keys have not changed. This is blocking our production deployment. Need urgent assistance.',
      priority: 'urgent',
      category: 'technical'
    },
    {
      title: 'Database connection timeout',
      description: 'Application shows "Database connection timeout" error frequently. This happens randomly and affects multiple users. Performance has degraded significantly. Please check server capacity.',
      priority: 'high',
      category: 'technical'
    }
  ],
  billing: [
    {
      title: 'Incorrect invoice amount',
      description: 'I received an invoice with an incorrect amount. I was charged $299 but my subscription plan is $199/month. Please review my account and issue a corrected invoice with refund.',
      priority: 'high',
      category: 'billing'
    },
    {
      title: 'Subscription not auto-renewed',
      description: 'My subscription was supposed to auto-renew on November 1st but it expired instead. My payment method is valid and has sufficient funds. Can you please reinstate my subscription?',
      priority: 'medium',
      category: 'billing'
    },
    {
      title: 'Request refund for cancelled service',
      description: 'I cancelled my service on October 15th but was still charged for the full month. According to your terms, I should get a prorated refund. Please process my refund at the earliest.',
      priority: 'medium',
      category: 'billing'
    },
    {
      title: 'Cannot update payment method',
      description: 'I am trying to update my credit card information but the system gives an error "Invalid card details" even though I have triple-checked all information. Need to update before next billing cycle.',
      priority: 'medium',
      category: 'billing'
    },
    {
      title: 'Duplicate charge on credit card',
      description: 'I was charged twice for the same subscription on November 5th. Please investigate and refund one of the duplicate charges immediately.',
      priority: 'urgent',
      category: 'billing'
    },
    {
      title: 'Invoice missing tax information',
      description: 'The invoice I received does not show any tax breakdown which I need for accounting purposes. Can you please send an updated invoice with proper tax information?',
      priority: 'low',
      category: 'billing'
    },
    {
      title: 'Payment declined but account charged',
      description: 'My payment was declined according to the system notification, but my bank statement shows the amount was deducted. Please clarify the status and reverse the charge if payment failed.',
      priority: 'high',
      category: 'billing'
    },
    {
      title: 'Cannot download invoice PDF',
      description: 'When I click "Download Invoice" button, nothing happens. I have tried different browsers but the issue persists. I need the invoice PDF for expense reporting.',
      priority: 'low',
      category: 'billing'
    }
  ],
  account: [
    {
      title: 'Need to change account email',
      description: 'I no longer have access to my registered email address and need to update it to my new email. Can you please help me change the primary email on my account?',
      priority: 'medium',
      category: 'account'
    },
    {
      title: 'Account locked after failed logins',
      description: 'My account got locked after I entered wrong password a few times. I have the correct password now but cannot login. Please unlock my account or guide me on how to unlock it.',
      priority: 'high',
      category: 'account'
    },
    {
      title: 'Cannot update profile information',
      description: 'I am trying to update my phone number and address in my profile but the "Save" button is disabled. Browser console shows no errors. Please help me update my information.',
      priority: 'low',
      category: 'account'
    },
    {
      title: 'Two-factor authentication not working',
      description: 'I enabled 2FA but the authentication codes from my authenticator app are being rejected as invalid. I have checked the time sync and everything is correct. Cannot login now.',
      priority: 'urgent',
      category: 'account'
    },
    {
      title: 'Request to delete my account',
      description: 'I would like to permanently delete my account and all associated data as per GDPR regulations. Please process my account deletion request and confirm once completed.',
      priority: 'medium',
      category: 'account'
    },
    {
      title: 'Merge duplicate accounts',
      description: 'I accidentally created two accounts with different email addresses. I would like to merge them into one account. Please help me consolidate my data and subscriptions.',
      priority: 'low',
      category: 'account'
    },
    {
      title: 'Security concern - suspicious activity',
      description: 'I noticed login attempts from unknown locations in my activity log. I have not authorized these logins. Please investigate if my account has been compromised and help me secure it.',
      priority: 'urgent',
      category: 'account'
    }
  ],
  general: [
    {
      title: 'How to use the advanced reporting feature',
      description: 'I recently subscribed to the premium plan and want to use the advanced reporting features. Is there any documentation or tutorial video that can help me understand how to create custom reports?',
      priority: 'low',
      category: 'general'
    },
    {
      title: 'Training materials request',
      description: 'We are onboarding new team members and need comprehensive training materials for the platform. Do you provide training guides, video tutorials, or webinar sessions for new users?',
      priority: 'low',
      category: 'general'
    },
    {
      title: 'Partnership opportunity inquiry',
      description: 'Our company is interested in exploring a partnership opportunity. We have a large customer base that could benefit from your services. Who should I contact regarding business development?',
      priority: 'low',
      category: 'general'
    },
    {
      title: 'Feature availability timeline',
      description: 'I read about upcoming features in your roadmap. Can you provide an estimated timeline for when the bulk import feature will be available? This is critical for our migration planning.',
      priority: 'medium',
      category: 'general'
    },
    {
      title: 'Service availability in new region',
      description: 'We are expanding our operations to Singapore. Is your service available in the APAC region? What are the data residency options and pricing for that region?',
      priority: 'medium',
      category: 'general'
    }
  ],
  complaint: [
    {
      title: 'Poor customer service experience',
      description: 'I contacted support three days ago but still have not received any response. This is completely unacceptable for a paid service. I expect better support response times.',
      priority: 'high',
      category: 'complaint'
    },
    {
      title: 'Long wait time for support',
      description: 'Every time I contact support, I have to wait 2+ hours for a response. For urgent issues, this delay is frustrating. Please improve your support team capacity.',
      priority: 'medium',
      category: 'complaint'
    },
    {
      title: 'Unresolved issue after multiple contacts',
      description: 'I have contacted support 5 times regarding the same issue but it remains unresolved. Each time I get transferred to a different agent who asks me to explain everything again. Very frustrating!',
      priority: 'high',
      category: 'complaint'
    },
    {
      title: 'Service interruption without notice',
      description: 'The service was down for 3 hours yesterday without any prior notification. This caused significant disruption to our business operations. We expect advance notice for planned maintenance.',
      priority: 'high',
      category: 'complaint'
    }
  ],
  feature_request: [
    {
      title: 'Add dark mode to the application',
      description: 'Please add a dark mode theme option to the application. Many users including myself prefer dark mode for reduced eye strain, especially when working late hours.',
      priority: 'low',
      category: 'feature_request'
    },
    {
      title: 'Export data to Excel feature',
      description: 'It would be very helpful to have an "Export to Excel" button for all data tables. Currently, we have to manually copy-paste data which is time-consuming for large datasets.',
      priority: 'medium',
      category: 'feature_request'
    },
    {
      title: 'Multi-language support',
      description: 'Please add support for multiple languages. We have team members who speak Spanish, French, and German. Multi-language support would greatly improve user experience.',
      priority: 'medium',
      category: 'feature_request'
    },
    {
      title: 'Advanced search filters',
      description: 'The current search is basic. Please add advanced filters like date range, multiple criteria, and saved search templates. This would make finding specific records much faster.',
      priority: 'low',
      category: 'feature_request'
    },
    {
      title: 'API webhook notifications',
      description: 'Please add webhook support for real-time event notifications. We want to integrate your platform with our internal systems and need to be notified when certain events occur.',
      priority: 'medium',
      category: 'feature_request'
    },
    {
      title: 'Mobile app for iOS',
      description: 'The Android app is great, but we need an iOS version as well. Many of our team members use iPhones and would benefit from a native iOS application.',
      priority: 'high',
      category: 'feature_request'
    }
  ]
};

type TicketAttachmentArray = NonNullable<ITicket['attachments']>;

const STATUSES = ['open', 'pending', 'in_progress', 'resolved', 'closed'];
const STATUS_WEIGHTS = {
  open: 0.25,
  pending: 0.20,
  in_progress: 0.15,
  resolved: 0.25,
  closed: 0.15
};

// Helper function to get weighted random status
function getWeightedRandomStatus(): string {
  const random = Math.random();
  let sum = 0;
  
  for (const [status, weight] of Object.entries(STATUS_WEIGHTS)) {
    sum += weight;
    if (random <= sum) {
      return status;
    }
  }
  
  return 'open';
}

// Helper function to get random date within last N days
function getRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  date.setHours(randomHours, randomMinutes, 0, 0);
  
  return date;
}

// Helper function to get resolved date if status is resolved or closed
function getResolvedDate(createdAt: Date, status: string): Date | null {
  if (status === 'resolved' || status === 'closed') {
    const resolvedDate = new Date(createdAt);
    const daysToResolve = Math.floor(Math.random() * 7) + 1; // 1-7 days
    resolvedDate.setDate(resolvedDate.getDate() + daysToResolve);
    return resolvedDate;
  }
  return null;
}

async function seedTickets() {
  try {
    console.log('🎫 Starting Ticket Seed Process...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vanphuccare';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing tickets
    const deleteCount = await MongoDbTickets.model.countDocuments();
    if (deleteCount > 0) {
      await MongoDbTickets.model.deleteMany({});
      console.log(`🗑️  Deleted ${deleteCount} existing tickets\n`);
    }

    // Get all customers and admins
    const customers = await MongoDbCustomers.model.find().limit(50).lean();
    const admins = await MongoDbAdmins.model.find().lean();

    if (customers.length === 0) {
      console.error('❌ No customers found. Please seed customers first.');
      process.exit(1);
    }

    if (admins.length === 0) {
      console.error('❌ No admins found. Please seed admins first.');
      process.exit(1);
    }

    console.log(`👥 Found ${customers.length} customers`);
    console.log(`👨‍💼 Found ${admins.length} admins\n`);

    // Generate tickets
    const tickets: any[] = [];
    let ticketCounter = 1;

    // Generate tickets from each category
    for (const [category, templates] of Object.entries(TICKET_TEMPLATES)) {
      console.log(`📝 Generating ${templates.length} tickets for category: ${category}`);
      
      for (const template of templates) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const status = getWeightedRandomStatus();
        const createdAt = getRandomDate(60); // Within last 60 days
        const resolvedDate = getResolvedDate(createdAt, status);
        
        // Assign to admin for non-open tickets
        let assignedTo = null;
        let resolvedBy = null;
        
        if (status !== 'open') {
          assignedTo = admins[Math.floor(Math.random() * admins.length)]._id;
        }
        
        if (status === 'resolved' || status === 'closed') {
          resolvedBy = assignedTo;
        }

        const ticket = {
          ticketNumber: `TK${String(ticketCounter).padStart(6, '0')}`,
          title: template.title,
          description: template.description,
          customerId: customer._id,
          assignedTo,
          priority: template.priority,
          status,
          category: template.category,
          attachments: [] as TicketAttachmentArray,
          notes: status === 'resolved' ? 'Issue has been resolved successfully.' : '',
          resolvedAt: resolvedDate,
          resolvedBy,
          createdAt,
          updatedAt: resolvedDate || createdAt
        };

        tickets.push(ticket);
        ticketCounter++;
      }
    }

    // Generate additional random tickets to reach 100 total
    const totalTicketsNeeded = 100;
    const additionalNeeded = totalTicketsNeeded - tickets.length;

    if (additionalNeeded > 0) {
      console.log(`\n🔄 Generating ${additionalNeeded} additional random tickets...\n`);
      
      const allTemplates = Object.values(TICKET_TEMPLATES).flat();
      
      for (let i = 0; i < additionalNeeded; i++) {
        const template = allTemplates[Math.floor(Math.random() * allTemplates.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const status = getWeightedRandomStatus();
        const createdAt = getRandomDate(90);
        const resolvedDate = getResolvedDate(createdAt, status);
        
        let assignedTo = null;
        let resolvedBy = null;
        
        if (status !== 'open') {
          assignedTo = admins[Math.floor(Math.random() * admins.length)]._id;
        }
        
        if (status === 'resolved' || status === 'closed') {
          resolvedBy = assignedTo;
        }

        const ticket = {
          ticketNumber: `TK${String(ticketCounter).padStart(6, '0')}`,
          title: template.title,
          description: template.description,
          customerId: customer._id,
          assignedTo,
          priority: template.priority,
          status,
          category: template.category,
          attachments: [] as TicketAttachmentArray,
          notes: status === 'resolved' ? 'Issue resolved.' : status === 'in_progress' ? 'Working on this issue.' : '',
          resolvedAt: resolvedDate,
          resolvedBy,
          createdAt,
          updatedAt: resolvedDate || createdAt
        };

        tickets.push(ticket);
        ticketCounter++;
      }
    }

    // Insert all tickets
    const insertedTickets = await MongoDbTickets.model.insertMany(tickets);
    console.log(`\n✅ Successfully created ${insertedTickets.length} tickets\n`);

    // Show statistics
    const stats = await MongoDbTickets.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('📊 Ticket Statistics by Status:');
    stats.forEach((stat: any) => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    const priorityStats = await MongoDbTickets.model.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📊 Ticket Statistics by Priority:');
    priorityStats.forEach((stat: any) => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    const categoryStats = await MongoDbTickets.model.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📊 Ticket Statistics by Category:');
    categoryStats.forEach((stat: any) => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n✨ Ticket seeding completed successfully!\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed\n');

  } catch (error) {
    console.error('❌ Error seeding tickets:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTickets();
