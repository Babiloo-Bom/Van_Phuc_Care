/**
 * Script to fix health_records unique index
 * Run this on production server after deployment
 * 
 * Usage: node scripts/fix-health-record-index.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_VPC_URI || 'mongodb://localhost:27017/vanphuccare';

async function fixIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('health_records');

    // List existing indexes
    console.log('\nExisting indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? ' (unique)' : ''}`);
    });

    // Drop old unique index on customerId + date if exists
    try {
      await collection.dropIndex('customerId_1_date_1');
      console.log('\n✅ Dropped old unique index: customerId_1_date_1');
    } catch (err) {
      if (err.code === 27) {
        console.log('\n⚠️ Index customerId_1_date_1 does not exist, skipping...');
      } else {
        throw err;
      }
    }

    // Create new unique index on healthBookId + date
    try {
      await collection.createIndex(
        { healthBookId: 1, date: 1 },
        { unique: true, name: 'healthBookId_1_date_1' }
      );
      console.log('✅ Created new unique index: healthBookId_1_date_1');
    } catch (err) {
      if (err.code === 85 || err.code === 86) {
        console.log('⚠️ Index healthBookId_1_date_1 already exists');
      } else {
        throw err;
      }
    }

    // Create non-unique index on customerId + date (if needed for queries)
    try {
      await collection.createIndex(
        { customerId: 1, date: 1 },
        { name: 'customerId_1_date_1' }
      );
      console.log('✅ Created non-unique index: customerId_1_date_1');
    } catch (err) {
      if (err.code === 85 || err.code === 86) {
        console.log('⚠️ Index customerId_1_date_1 already exists');
      } else {
        throw err;
      }
    }

    // List final indexes
    console.log('\nFinal indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? ' (unique)' : ''}`);
    });

    console.log('\n✅ Index fix completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixIndex();
