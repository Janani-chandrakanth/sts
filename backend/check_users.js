const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/.env' });

mongoose.connect(process.env.MONGO_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('Connected to DB:', mongoose.connection.name);
    const db = mongoose.connection.db;
    
    console.log('--- Raw Collection Test ---');
    const usersCol = db.collection('users');
    const count = await usersCol.countDocuments();
    console.log('Raw users count:', count);
    
    const docs = await usersCol.find().sort({ _id: -1 }).limit(1).toArray();
    console.log('Last raw user:', JSON.stringify(docs, null, 2));
    
    console.log('--- Mongoose Model Test ---');
    const User = require('c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/models/User');
    console.log('Mongoose collection name:', User.collection.name);
    
    try {
      const mCount = await User.countDocuments().maxTimeMS(2000);
      console.log('Mongoose users count:', mCount);
    } catch (e) {
      console.log('Mongoose count error:', e.message);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err.message);
    process.exit(1);
  });
