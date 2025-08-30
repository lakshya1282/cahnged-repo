const mongoose = require('mongoose');

async function tryConnection() {
  const connectionOptions = [
    'mongodb://localhost:27017/devnovate-blog',
    'mongodb://localhost:27017/',
    'mongodb://127.0.0.1:27017/devnovate-blog',
    'mongodb://127.0.0.1:27017/',
  ];
  
  for (const connectionString of connectionOptions) {
    try {
      console.log(`Trying connection: ${connectionString}`);
      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ Connected successfully!');
      console.log('Database name:', mongoose.connection.db.databaseName);
      
      // Try to get server info
      const admin = mongoose.connection.db.admin();
      const result = await admin.serverStatus();
      console.log('MongoDB version:', result.version);
      console.log('Authentication required:', result.security ? result.security.SSLServerSubjectName ? 'Yes' : 'No' : 'Unknown');
      
      await mongoose.disconnect();
      return true;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      try {
        await mongoose.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }
  
  console.log('\n❌ All connection attempts failed');
  return false;
}

tryConnection();
