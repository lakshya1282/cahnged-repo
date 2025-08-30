const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Try connecting to MongoDB without authentication
    await mongoose.connect('mongodb://localhost:27017/devnovate-blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Try to create the database and collections if they don't exist
    const db = mongoose.connection.db;
    
    // Create users collection
    try {
      await db.createCollection('users');
      console.log('✅ Users collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✅ Users collection already exists');
      } else {
        console.log('⚠️ Users collection error:', error.message);
      }
    }
    
    // Create blogs collection
    try {
      await db.createCollection('blogs');
      console.log('✅ Blogs collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✅ Blogs collection already exists');
      } else {
        console.log('⚠️ Blogs collection error:', error.message);
      }
    }
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    console.log('✅ Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
